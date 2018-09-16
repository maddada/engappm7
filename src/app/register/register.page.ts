import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../core/auth.service';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { FirestoreService } from '../core/firestore.service';

import { User } from '../../model';

import { Observable } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { ShowToastService } from '../core/show-toast.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(
    private nav: NavController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private auth: AuthService,
    private storage: AngularFireStorage,
    private db: FirestoreService,
    private toast: ShowToastService,
  ) {

  }





  public newUser: User = { type: -1 };
  protected uploadPercent: Observable<number>;
  protected downloadURL: Observable<string>;

  private uploadData: any;

  private selectedFile: any;

  private newUserDoc: AngularFirestoreDocument<User>;

  private selectedSupplierCategories: string[] = [];


  // We're binding to a select to get these
  // We're recieving them as string
  // Later do this:
  // this.newUser.city = Number(this.selectedCity);
  // to convert from string to number
  protected selectedCity: string;

  protected selectedType: string;



  // used to access input and clear it
  // (if file selected for upload is too big or disallowed type)
  @ViewChild('uploadButton')
  private myUploadButton: ElementRef;


  showTerms: boolean;

  termsCheckBoxValue: boolean;





  ngOnInit() {
  }













  protected onSubmit(): void {

    if (this.validateInputs()) {
      this.emailSignUp();
    }
    else {
      return;
    }
  }


























  // Validation Function (Before Registering)
  // Will return true or false based on required fields
  //
  private validateInputs(): boolean {


    switch (this.newUser.type) {

      case 1: {
        if (
          isNaN(this.newUser.city) ||
          this.newUser.personName.length === 0 ||
          this.newUser.email.length === 0 ||
          this.newUser.password.length === 0) {

          this.toast.showToast(`A Required Field is Empty!`);
          return false;

        }

        return true;
        break;
      }

      case 2:
      case 3: {
        if (
          isNaN(this.newUser.city) ||
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
          !this.newUser.class ||
          this.newUser.class.length === 0 ||
          !this.uploadData) {

          this.toast.showToast(`A Required Field is Empty!`);
          return false;

        }
        return true;
        break;
      }

      case 4: {
        if (
          isNaN(this.newUser.city) ||
          !this.newUser.email ||
          this.newUser.email.length === 0 ||
          !this.newUser.password || this.newUser.password.length === 0 ||
          !this.newUser.companyName ||
          this.newUser.companyName.length === 0 ||
          !this.newUser.phoneNumber ||
          this.newUser.phoneNumber.length === 0 ||
          !this.newUser.personName ||
          this.newUser.personName.length === 0 ||
          !this.newUser.mobileNumber ||
          this.newUser.mobileNumber.length === 0 ||
          this.selectedSupplierCategories.length === 0 ||
          !this.uploadData) {
          this.toast.showToast(`A Required Field is Empty!`);
          return false;

        }
        return true;
        break;
      }
      default: {
        this.toast.showToast(`Select an Account Type!`);
        return false;
      }
    }

  }

















  //// Email/Password Auth ////

  private emailSignUp() {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(this.newUser.email, this.newUser.password)
      .then((credential) => {

        this.newUser.uid = credential.user.uid;

        this.newUserDoc = this.afs.doc(`users/${this.newUser.uid}`);

        if (this.newUser.type !== 1) {
          this.startUpload();
        } else {
          this.afterUserRegistered();
        }
        // User data gets uploaded after uploading file and
        // getting uploadUrl

        return;
      })
      .catch(error => this.handleError(error));
  }













  // SAVES DATA OF FILE THAT WAS ADDED FOR LATER. (protected since I use it in html)
  // This is used in the template, dw about no reference found
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

      this.toast.showToast(`File selected is too large! (Max is 10mb)`);
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

      this.toast.showToast(`File format not Supported! (Only Images/PDF/Word)`);
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
    // name of file in cloud storage
    const filePath = `users/${this.newUser.uid}/${current_date}_license_copy`;
    const fileRef = this.storage.ref(filePath);

    // start upload task
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();


    // get notified when the download URL is available
    task.snapshotChanges().pipe(

      finalize(() => { // when upload task done do this:
        // set downloadURL observable
        this.downloadURL = fileRef.getDownloadURL();

        // then get the URL from this observable [take(1)],
        // and call afterUserRegistered() after you get it!
        this.downloadURL.pipe(
          take(1),

          finalize(() => {
            this.afterUserRegistered();
          })

        ).subscribe((val) => {
          this.newUser.licenceURL = val;

          console.log(`this.newUser.licenceURL:`, this.newUser.licenceURL);
        });
      })

    ).subscribe();
  }























  toggleShowingTerms() {
    this.showTerms = !this.showTerms;
  }




  toggleTermsCheckBoxValue() {
    // console.log(this.termsCheckBoxValue);
    if (this.termsCheckBoxValue == null) {
      this.termsCheckBoxValue = false;
    }
    else if (this.termsCheckBoxValue === true) {
      this.termsCheckBoxValue = false;
    } else {
      this.termsCheckBoxValue = true;
    }
    console.log(this.termsCheckBoxValue);
  }










  private delay(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
  }



  private async afterUserRegistered() {

    await this.db.setTS(this.newUserDoc, this.newUser);

    this.toast.showToast(`Registration Successful, Welcome!`);
    console.log('AFTER USER REGISTERED RAN');

    await this.delay(1500);

    this.nav.navigateForward('/');
  }
























  protected onSelectType($event): any {
    this.newUser.type = Number(this.selectedType);
  }






  protected onSelectCity($event): any {
    this.newUser.city = Number(this.selectedCity);
  }








  protected onSelectSupplierCategory($event): any {

    if ($event.detail.value.length > 0) {
      this.selectedSupplierCategories = $event.detail.value;
    }

  }


  // console.log(event);
  // array that has all selected element's values:
  // ex: ["c_blocks", "c_ceramics", "c_interlock"]
  // Working
  // console.log(event.detail.value);
  // console.log(this.selectedSupplierCategories);
  // Upload this to each supplier document as
  // _tags array and it'll be used for
  // searching using algolia later.



  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    this.toast.showToast(`${error}`);
  }



}
// END OF FILE HERE






