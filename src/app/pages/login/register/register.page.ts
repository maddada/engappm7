import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { FirestoreService } from '../../../core/firestore.service';

import { User } from '../../../../model';

import { Observable } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { ShowToastService } from '../../../core/show-toast.service';
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
    private storage: AngularFireStorage,
    private db: FirestoreService,
    private toast: ShowToastService,
  ) {

  }




  public newUser: User = { accountType: -1 };
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
  protected selectedClass: string;

  protected selectedType: string;

  protected selectedSector: string;

  showTerms: boolean;
  termsCheckBoxValue: boolean;


  // used to access input and clear it
  // (if file selected for upload is too big or disallowed type)
  @ViewChild('uploadButton')
  private myUploadButton: ElementRef;

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

  protected onTestClicked(): void {

    if (this.validateInputs()) {
      console.log("TEST REGISTRATION SUCCESSFUL!");
    }
    else {
    }
    // console.log("this.termsCheckBoxValue", this.termsCheckBoxValue)

    // console.log("this.newUser.govSector", this.newUser.govSector)

    // console.log("this.uploadData", this.uploadData);
  }





  // Validation Function (Before Registering)
  // Will return true or false based on required fields
  //
  private validateInputs(): boolean {

    if (this.termsCheckBoxValue === false ||
      this.termsCheckBoxValue == null ||
      isNaN(this.newUser.city) ||
      this.newUser.email == null ||
      this.newUser.email.length === 0 ||
      this.newUser.password == null ||
      this.newUser.password.length === 0 ||
      this.newUser.personName == null ||
      this.newUser.personName.length === 0 ||
      this.newUser.personNumber == null ||
      this.newUser.personNumber.length === 0
    ) {
      console.log("stopped here");
      this.toast.showToast(`A Required Field is Empty!`);
      return false;
    }




    switch (this.newUser.accountType) {

      case 1: {

        return true;
      }

      case 2:
        if (this.newUser.govSector == null) {
          this.toast.showToast(`A Required Field is Empty!`);
          console.log("stopped here");
          return false;
        }
      // tslint:disable-next-line
      case 3: {
        if (
          isNaN(this.newUser.city) ||
          this.newUser.companyName == null ||
          this.newUser.companyName.length === 0 ||
          this.newUser.companyNumber == null ||
          this.newUser.companyNumber.length === 0 ||
          isNaN(this.newUser.class) ||
          this.uploadData == null) {
          console.log("stopped here");
          this.toast.showToast(`A Required Field is Empty!`);
          return false;
        } else {
          return true;
        }
      }

      case 4: {
        if (
          isNaN(this.newUser.city) ||
          this.newUser.companyName == null ||
          this.newUser.companyName.length === 0 ||
          this.newUser.companyNumber == null ||
          this.newUser.companyNumber.length === 0 ||
          this.newUser.tags.length === 0 ||
          this.uploadData == null) {
          console.log("stopped here");
          this.toast.showToast(`A Required Field is Empty!`);
          return false;

        } else {
          return true;
        }
      }

      default: {
        this.toast.showToast(`Select an Account Type!`);
        return false;
      }
    }

  }




  //// NOTE: Email/Password Auth ////

  private emailSignUp() {

    this.setTags();

    return this.afAuth.auth
      .createUserWithEmailAndPassword(this.newUser.email, this.newUser.password)
      .then((credential) => {

        this.newUser.uid = credential.user.uid;

        this.newUserDoc = this.afs.doc(`users/${this.newUser.uid}`);

        if (this.newUser.accountType !== 1) {
          this.startUpload();
        } else {
          this.afterUserRegistered();
        }

        return;
      })
      .catch(error => this.handleError(error));
  }




  private setTags(): void {
    //NOTE: Set User Type Tags
    switch (this.newUser.accountType) {
      case 1:
        this.newUser.tags.push('individual');
        break;

      case 2:
        this.newUser.tags.push('company');
        this.newUser.tags.push('company_consultant');
        break;

      case 3:
        this.newUser.tags.push('company');
        this.newUser.tags.push('company_contractor');
        break;

      case 4:
        this.newUser.tags.push('company');
        this.newUser.tags.push('company_supplier');
        break;

      default:
        break;
    }

    //NOTE: Set City Tags
    switch (this.newUser.city) {
      case 1:
        this.newUser.tags.push('city_dxb');
        break;

      case 2:
        this.newUser.tags.push('city_shj');
        break;

      case 3:
        this.newUser.tags.push('city_aj');
        break;

      case 4:
        this.newUser.tags.push('city_ad');
        break;
      case 5:
        this.newUser.tags.push('city_ain');
        break;

      case 6:
        this.newUser.tags.push('city_fuj');
        break;

      case 7:
        this.newUser.tags.push('city_rak');
        break;

      case 8:
        this.newUser.tags.push('city_umq');
        break;

      default:
        break;
    }
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
    this.newUser.accountType = Number(this.selectedType);
  }



  protected onSelectCity($event): any {
    this.newUser.city = Number(this.selectedCity);
  }

  protected onSelectClass($event): any {
    this.newUser.class = Number(this.selectedClass);
  }


  protected onSelectSector($event): any {
    if (this.selectedSector === "gov") {
      this.newUser.govSector = true;
    }
    else if (this.selectedSector === "private") {
      this.newUser.govSector = false;
    }
  }



  protected onSelectSupplierCategory($event): any {

    if ($event.detail.value.length > 0) {
      this.selectedSupplierCategories = $event.detail.value;
      this.newUser.tags = this.selectedSupplierCategories;
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






