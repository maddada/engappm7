import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { FirestoreService } from '../../core/firestore.service';

import { Tender, User } from '../../../model';

import { Observable } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { ShowToastService } from '../../core/show-toast.service';
import { NavController } from '@ionic/angular';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-create-tender',
  templateUrl: './create-tender.page.html',
  styleUrls: ['./create-tender.page.scss'],
})
export class CreateTenderPage implements OnInit {

  constructor(
    private nav: NavController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private db: FirestoreService,
    private toast: ShowToastService,
    public element: ElementRef,
  ) {

  }

  deadlineDate;

  public newTender: Tender = {
    // createdAt?: any; // publish date
    // updatedAt?: any; // publish date

    // deadline?: Timestamp; //always 12 pm

    // createdBy?: string; // uid

    // creatorEmail?: string;
    // // Get Company Email from CreatedBy

    // nameOfCompany?: string;
    // nameOfPerson?: string;
    // numberOfContactPerson?: string;

    // numberOfProposals?: number;

    // participationFee?: number;
    // // رسوم الإشتراك في المناقصة

    // bidBondPercent?: number;
    // // الكفالة المصرفية

    // sector?: number; // 1- goverment, 2- private

    // city?: number;

    // category?:;

    // participants?: string[];

    // attachmentURLs?: string[];
  };

  protected uploadPercent: Observable<number>;
  protected downloadURL: Observable<string>;

  private filesToUpload: any[];

  private newTenderDoc: AngularFirestoreDocument<Tender>;

  selectedFiles: any[] = [];

  termsCheckBoxValue: boolean;
  datePickerMaxYear: number;
  numberOfAttachments: number;

  selectedNumOfAttachments: string = '0';



  // used to access input and clear it
  // (if file selected for upload is too big or disallowed type)
  @ViewChild('uploadButton1')
  private myUploadButton1: ElementRef;

  @ViewChild('uploadButton2')
  private myUploadButton2: ElementRef;

  @ViewChild('uploadButton3')
  private myUploadButton3: ElementRef;

  ngOnInit() {
    this.setMaxYear();
  }



  protected setMaxYear() {
    let temp = new Date();
    this.datePickerMaxYear = temp.getFullYear() + 1;
  }


  // NOTE:    1- onSubmit
  protected onSubmit(): void {

    if (this.validateInputs()) {
      this.createTender();
    }
    else {
      return;
    }
  }


  // NOTE:    2- createTender
  protected createTender() {

    if (this.numberOfAttachments !== 0) {
      this.uploadFiles();
    }

  }

  // NOTE:    3- onTestClicked
  protected onTestClicked(): void {

    if (this.validateInputs()) {
      console.log("TEST REGISTRATION SUCCESSFUL!");
    }
    else {
    }
    // console.log("this.termsCheckBoxValue", this.termsCheckBoxValue)

    // console.log("this.newTender.govSector", this.newTender.govSector)

    // console.log("this.uploadData", this.uploadData);
  }




  // NOTE:    4- validateInputs
  // Validation Function (Before Registering)
  // Will return true or false based on required fields
  private validateInputs() {

    if (this.termsCheckBoxValue === false ||
      this.termsCheckBoxValue == null ||
      isNaN(this.newTender.city) ||
      this.newTender.tenderTitle == null ||
      this.newTender.tenderTitle.length === 0 ||
      this.newTender.tenderSummary == null ||
      this.newTender.tenderSummary.length === 0
    ) {
      console.log("stopped here");
      this.toast.showToast(`A Required Field is Empty!`);
      return false;
    }

  }




  // NOTE:      setUpload
  // SAVES DATA OF FILE THAT WAS ADDED FOR LATER. (protected since I use it in html)
  protected setUpload(event, number) {

    number = number - 1; //arrays start at 0
    this.selectedFiles[number] = event.target.files[0];

    // If no file was selected
    if (this.selectedFiles[number] == null) {
      return;
    }

    let newFileType: string = this.selectedFiles[number].type;

    // checking if file is compatible
    // If file is over 10 mbs
    if (this.selectedFiles[number].size > 10485760) {
      this.toast.showToast(`File selected is too large! (Max is 10mb)`);

      switch (number) {
        case 1: {
          this.myUploadButton1.nativeElement.value = '';
          break;
        }
        case 2: {
          this.myUploadButton2.nativeElement.value = '';
          break;
        }
        case 3: {
          this.myUploadButton3.nativeElement.value = '';
          break;
        }
      }

      return;
    } else if (
      // Else if file is one of these formats, add it
      // to uploadData

      //all images (png gif jpg)
      newFileType.includes('image') ||
      //pdf
      newFileType.includes('application/pdf') ||
      //doc
      newFileType.includes('application/msword') ||
      //docx
      newFileType.includes('application/vnd.openxmlformats-officedocument')) {

      this.filesToUpload[number] = event;

    } else { // if it's not one of the formats then don't upload it

      this.toast.showToast(`File format not Supported! (Only Images/PDF/Word)`);

      switch (number) {
        case 1: {
          this.myUploadButton1.nativeElement.value = '';
          break;
        }
        case 2: {
          this.myUploadButton2.nativeElement.value = '';
          break;
        }
        case 3: {
          this.myUploadButton3.nativeElement.value = '';
          break;
        }
      }
    }


    console.log(`File ${number} Set:`);
    console.log(this.filesToUpload[number]);
    return;
  }



  // NOTE: Upload Files
  uploadFiles() {
    for (let i = 1; i <= this.selectedFiles.length; i++) {
      this.startUploadFile(i);
    }
  }



  // NOTE: Start Upload
  // STARTS UPLOAD OF SAVED FILE.
  private startUploadFile(number) {

    // (cuz filesToUpload contains the events!)
    let file = this.filesToUpload[number].target.files[0];
    let fileName = file.name;

    // name of file in cloud storage
    const filePath = `users/${this.newTender.createdBy}/${this.newTender.tenderId}`;
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
          this.newTender.attachmentURLs.push(val);

          console.log(`this.newTender.licenceURL:`, this.newTender.attachmentURLs);
        });
      })

    ).subscribe();
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

    await this.db.setTS(this.newTenderDoc, this.newTender);

    this.toast.showToast(`Registration Successful, Welcome!`);
    console.log('AFTER USER REGISTERED RAN');

    await this.delay(1500);

    this.nav.navigateForward('/');
  }

  protected onSelectNumOfAttachments($event): any {
    this.newTender.numOfAttachments = Number(this.selectedNumOfAttachments);
  }



  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    this.toast.showToast(`${error}`);
  }


}
