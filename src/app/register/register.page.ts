import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuController, ToastController } from '@ionic/angular';

import { AuthService } from '../core/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFireAuth } from 'angularfire2/auth';

import { FirestoreService } from '../core/firestore.service';

import { User } from '../../model';

import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {












  public newUser: User = { type: -1 };

  private newUserGUID: string;

  private uploadPercent: Observable<number>;
  private downloadURL: Observable<string>;

  private uploadData: any;

  private selectedFile: any;

  private newUserDoc: AngularFirestoreDocument<User>;

  // used to access input and clear it
  // (if file selected for upload is too big or disallowed type)
  @ViewChild('uploadButton')
  private myUploadButton: ElementRef;














  constructor(
    private toastController: ToastController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private menuCtrl: MenuController,
    private auth: AuthService,
    private db: FirestoreService) {

  }









  ngOnInit() {
    // this.menuCtrl.enable(false);
  }










  // SAVES DATA OF FILE THAT WAS ADDED FOR LATER. (protected since I use it in html)
  protected setUpload(event) {

    this.selectedFile = event.target.files[0];

    // If no file was selected
    if (!this.selectedFile) {
      return;
    }

    let newFileType: string = this.selectedFile.type;

    // checking if file is compatible
    // If file is over 10 mbs
    if (this.selectedFile.size > 10485760) {

      this.showToast(`File selected is too large! (Max is 10mb)`);
      this.myUploadButton.nativeElement.value = ''; //clearing file input!
      return;

    } else if ( // Else if file is one of these formats, upload it

      //all images (png gif jpg)
      newFileType.includes('image') ||
      //pdf
      newFileType.includes('application/pdf') ||
      //doc
      newFileType.includes('application/msword') ||
      //docx
      newFileType.includes('application/vnd.openxmlformats-officedocument')) {

      this.uploadData = event;
      return;

    } else { // if it's not one of the formats then don't upload it

      this.showToast(`File format not Supported! (Only Images/PDF/Word)`);
      this.myUploadButton.nativeElement.value = ''; //clearing file input!
      return;
    }
    console.log(this.uploadData);

  }


















  // STARTS UPLOAD OF SAVED FILE.
  private startUpload() {
    function zerofill(i) {
      return (i < 10 ? '0' : '') + i;
    }

    function getDateString() {
      const date = new Date();
      const year = date.getFullYear();
      const month = zerofill(date.getMonth() + 1);
      const day = zerofill(date.getDate());
      return year + '-' + month + '-' + day;
    }

    const current_date = getDateString();
    console.log(current_date);

    const file = this.uploadData.target.files[0];
    const filePath = `users/newUserGUID/${current_date}_license_copy`; // name of file on
    const fileRef = this.storage.ref(filePath);

    const task = this.storage.upload(filePath, file);
    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = fileRef.getDownloadURL())
    )
      .subscribe();

  }












  protected onRegisterClick(): void {

    if (this.validateInputs()) {
      this.emailSignUp();
      this.uploadData();
      this.afterUserLogin();
    }

  }


























  // Validation Function (Before Registering)
  private validateInputs(): boolean {

    //type coming from select input is string!!
    console.log(typeof this.newUser.type);

    // Convert value to number
    let userType: number = +this.newUser.type;
    console.log(typeof userType);

    switch (userType) {

      case 1: {
        if (
          !this.newUser.city ||
          this.newUser.personName.length === 0 ||
          this.newUser.email.length === 0 ||
          this.newUser.password.length === 0) {

          this.showToast(`A Required Field is Empty!`);
          return false;

        }

        return true;
        break;
      }

      case 2:
      case 3: {
        if (
          !this.newUser.city ||
          !this.newUser.email ||
          this.newUser.email.length === 0 ||
          !this.newUser.password ||
          this.newUser.password.length === 0 ||
          !this.newUser.companyName ||
          this.newUser.companyName.length === 0 ||
          !this.newUser.phoneNumber ||
          this.newUser.phoneNumber.length === 0 ||
          !this.newUser.personName ||
          this.newUser.personName.length === 0 ||
          !this.newUser.mobileNumber ||
          this.newUser.mobileNumber.length === 0 ||
          this.newUser.class ||
          !this.uploadData) {

          this.showToast(`A Required Field is Empty!`);
          return false;

        }
        return true;
        break;
      }

      case 4: {
        if (!this.newUser.city ||
          this.newUser.email.length === 0 ||
          this.newUser.email.length === 0 ||
          this.newUser.password.length === 0 ||
          this.newUser.password.length === 0 ||
          this.newUser.companyName.length === 0 ||
          this.newUser.companyName.length === 0 ||
          this.newUser.phoneNumber.length === 0 ||
          this.newUser.phoneNumber.length === 0 ||
          this.newUser.personName.length === 0 ||
          this.newUser.personName.length === 0 ||
          this.newUser.mobileNumber.length === 0 ||
          this.newUser.mobileNumber.length === 0 ||
          this.newUser.class.length === 0 ||
          this.newUser.class.length === 0 ||
          // !this.newUser.category ||
          !this.uploadData) {

          this.showToast(`A Required Field is Empty!`);
          return false;

        }
        return true;
        break;
      }
      default: {
        this.showToast(`Select an Account Type!`);
        return;
      }
    }

  }















  //// Email/Password Auth ////

  private emailSignUp() {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(this.newUser.email, this.newUser.password)
      .then((credential) => {

        //find out which type, each goes in different doc.
        switch (this.newUser.type) {
          case 1: {
            this.newUserDoc = this.afs.doc(`individual/${credential.user.uid}`);
            break;
          }
          case 2: {
            this.newUserDoc = this.afs.doc(`consultant/${credential.user.uid}`);
            break;
          }
          case 3: {
            this.newUserDoc = this.afs.doc(`contractor/${credential.user.uid}`);
            break;
          }
          case 4: {
            this.newUserDoc = this.afs.doc(`supplier/${credential.user.uid}`);
            break;
          }
          default: {
            break;
          }
        }

        let data: User = this.newUser;

        //convert from string to number
        data.city = +this.newUser.city;
        data.type = +this.newUser.type;

        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();

        // this will start uploading file selected before!
        this.startUpload();

        this.newUserDoc.set(data);

        // this.notify.update('Welcome new user!', 'success');
        this.showToast(`Registration Successful! Welcome!`);



        return this.updateUserData(credential.user);
      })
      .catch(error => this.handleError(error));
  }








  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      position: 'bottom',
      duration: 5000,
      translucent: false,

      // showCloseButton: true,
      // closeButtonText: 'Done'
    });
    toast.present();
  }

  private afterUserLogin() {

    //
    this.updateUserData(this.newUser);

    // go to homepage

  }





  // Sets user data to firestore after succesful login
  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data: User = {
      uid: user.uid,
      email: user.email || null,
      companyName: user.companyName || ' ',
      // TODO: upload a new no user pic image.
      photoURL: user.photoURL
    };

    return userRef.set(data);
  }






  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
  }


  // TODO: WRITE CREATE USER FUNCTION:
  // createNewUser(): void {

  // Check if all required fields are filled (if not show message)
  // this.validateInputs();


  // Set all the variables and create the user in firebase
  // if (this.newUser.type == null) { return; }

  // Upload the file and get file url:
  // this.startUpload();

  // newComp.x5_header_image = this.uploadURL;


  //   return;
  // }

  // newComp.formElementsArray = formElementsArray;

  // this.db.upsert('_meta/info', { 'numberOfCompetitions': this.newNumberOfCompetitions });
  // console.log('newNumberOfCompetitions:::', this.newNumberOfCompetitions);

  // newComp.x0_id = this.newCompID; //comp${numberOfCompetitions};

  // this.db.upsert(`competitions/${newComp.x0_id}`, newComp);

  // if (newComp.phase2Of !== null) {
  //   this.db.upsert(`competitions/${newComp.phase2Of}`, { 'phase1Of': newComp.x0_id });
  // }

  // newComp.x8_link = `https://mubadrah.ae/c/${newComp.x0_id}`;

  // console.log(JSON.stringify(newComp, null, 4));

  // this.router.navigateByUrl('/competitions');

  // }


}




