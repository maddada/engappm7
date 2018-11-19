import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { FirestoreService } from '../../core/firestore.service';

import { Tender, User } from '../../../model';

import { Observable } from 'rxjs';
import { finalize, take, map } from 'rxjs/operators';
import { ShowToastService } from '../../core/show-toast.service';
import { NavController, LoadingController } from '@ionic/angular';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthService } from '../../core/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-create-tender',
  templateUrl: './create-tender.page.html',
  styleUrls: ['./create-tender.page.scss'],
})
export class CreateTenderPage implements OnInit {

  public newTender: Tender = {};

  // public uploadPercents$: Observable<any>[] = [];
  public uploadPercent0: Observable<any>;
  public uploadPercent1: Observable<any>;
  public uploadPercent2: Observable<any>;

  public downloadURLs$: Observable<string>[];

  public selectedDeadline: string;
  public summaryTemp: any;

  private filesToUpload: any[] = []; //Accepted Files

  termsCheckBoxValue: boolean;
  datePickerMinYear: number;
  datePickerMaxYear: number;



  // Used to access input and clear it
  // (if file selected for upload is too big or disallowed type)
  // Use 1 2 3 in UI ONLY! Everywhere else use 0 1 2 to avoid confusion.
  @ViewChild('uploadButton0')
  public myUploadButton0: ElementRef;

  @ViewChild('uploadButton1')
  public myUploadButton1: ElementRef;

  @ViewChild('uploadButton2')
  public myUploadButton2: ElementRef;

  private myUploadButtons: ElementRef[];

  showLoading: any;

  constructor(
    private nav: NavController,
    private ngFireStorage: AngularFireStorage,
    private db: FirestoreService,
    private auth: AuthService,
    private toast: ShowToastService,
    public element: ElementRef,
    public loadingCtrl: LoadingController,
    public translate: TranslateService,
    public storage: Storage,
  ) {

  }



  ngOnInit() {


    // Settings Deadline Picker Min and Max Year:
    let temp = new Date();
    this.datePickerMaxYear = temp.getFullYear() + 1;
    this.datePickerMinYear = temp.getFullYear();

    // Initializing newTender properties
    this.newTender.participationFee = 0;
    this.newTender.bidBondPercent = 0;
    this.newTender.participants = [];

    // Initializing attachments arrays
    this.newTender.tenderTitle = '';
    this.newTender.tenderContactEmail = '';
    this.newTender.tenderContactWhatsapp = '';
    this.newTender.tenderContactNumber = '';

    this.filesToUpload = ['NOT-SET', 'NOT-SET', 'NOT-SET'];
    this.newTender.attachmentURLs = [];
    this.downloadURLs$ = [];

    // Setting My Upload Buttons Array
    this.myUploadButtons = [];
    this.myUploadButtons.push(this.myUploadButton0);
    this.myUploadButtons.push(this.myUploadButton1);
    this.myUploadButtons.push(this.myUploadButton2);
  }


  // NOTE:
  // NOTE:
  // NOTE:
  // NOTE:
  // NOTE:
  // NOTE:
  // NOTE: Upload Related Functions!!!
  // NOTE:

  // NOTE:   START POINT!!! onSubmit -> Validates then Starts Uploading the 3 Files
  public async onCreateClicked() {

    if (this.s1_validateAndFixInputs()) {

      this.showLoading = await this.loadingCtrl.create({
        translucent: false,
        spinner: "bubbles",
        showBackdrop: true,
        animated: true,
        keyboardClose: true,
        mode: "md",
      });
      await this.showLoading.present();

      this.s2_startUploadFile(0);
    }
    else {
      return;
    }
  }



  // NOTE:    STEP 1- validateInputs
  private s1_validateAndFixInputs(): boolean {

    /** NOTE: xd
      participation fee and bid bond percent aren't needed!
      isNaN(this.newTender.participationFee) ||
      isNaN(this.newTender.bidBondPercent)
    */
    if (
      this.newTender.tenderTitle == null ||
      this.newTender.tenderTitle.length === 0 ||
      this.newTender.tenderContactWhatsapp == null ||
      this.newTender.tenderContactWhatsapp.length === 0 ||
      this.newTender.tenderContactEmail == null ||
      this.newTender.tenderContactEmail.length === 0 ||
      this.newTender.tenderCategory == null ||
      this.newTender.deadline == null
    ) {
      // console.log(this.newTender.tenderCategory);
      // console.log(this.newTender.deadline);
      if (this.translate.currentLang === 'ar') {
        this.toast.showToast(`يوجد خانة إلزامية لم يتم تعبأتها`);
      } else if (this.translate.currentLang === 'en') {
        this.toast.showToast(`A Required Field is Empty!`);
      }

      return false;
    }

    // Fixing Inputs:

    if (this.summaryTemp != null) {
      this.newTender.tenderSummary =
        this.summaryTemp.replace(/\n/g, '<br>');
    }
    else if (this.summaryTemp == null) {
      this.newTender.tenderSummary = '';
    }

    return true;
  }




  // NOTE: STEP 2 - StartUploadFile Uploads files saved in filesToUpload[]
  private s2_startUploadFile(number: number) {

    if (this.filesToUpload[number] === 'NOT-SET' && number < 2) {
      // NOTE: IF ATTACHMENT IS NOT SET, THEN UPLOAD THE NEXT ONE!
      return this.s2_startUploadFile(number + 1);

    } else if (this.filesToUpload[number] === 'NOT-SET' && number === 2) {
      // NOTE: IF LAST ATTACHMENT IS NOT SET, GO TO CREATE TENDER!
      return this.s3_createTender();
    }

    //NOTE: IF THIS ATTACHMENT IS SET, THEN START UPLOADING IT!

    // get the file from event (cuz filesToUpload contains the events!)
    let file = this.filesToUpload[number].target.files[0];

    // name of file in cloud storage
    const filePath = `users/${this.newTender.uid}/${this.newTender.tenderId}/${file.name}`;
    const fileRef = this.ngFireStorage.ref(filePath);

    // start upload task
    const task = this.ngFireStorage.upload(filePath, file);

    // observe percentage changes
    switch (number) {
      case 0:
        this.uploadPercent0 = task.percentageChanges();
        break;
      case 1:
        this.uploadPercent1 = task.percentageChanges();
        break;
      case 2:
        this.uploadPercent2 = task.percentageChanges();
        break;
      default:
        break;
    }

    // get notified when the download URL is available
    // NOTE: 1- subscribing to upload task, to be notified when upload is done!
    task.snapshotChanges().pipe(
      finalize(() => {
        // NOTE: 2- when upload is done, set downloadURLs$ observable to fileRef.getDownloadURL observable
        this.downloadURLs$[number] = fileRef.getDownloadURL();

        // NOTE: 3- then subscribe to get the URL from downloadURLs$ observable [using take(1) to get only 1st value emitted],
        this.downloadURLs$[number].pipe(
          take(1),
          // NOTE: 5- After the attachmentURLs is set:
          finalize(() => {
            // ON URL OBSERVABLE COMPLETE
            // NOTE: A- If more files left to upload then upload them!
            if (number < 2) {
              this.s2_startUploadFile(number + 1);
            }

            // NOTE: B- If this was the last file, then call s3_createTender()!
            else if (number === 2) {
              this.s3_createTender();
            }

          })
        ).subscribe((val) => {
          // this gets called after every next() (emission)
          // NOTE: 4- After the URL is recieved, set attachmentURLs[number] to the URL, THEN GO TO 5 IN FINALIZE!
          this.newTender.attachmentURLs.push(val);
          // console.log(`this.newTender.attachmentURLs[number]:`, this.newTender.attachmentURLs);
        });
      })).subscribe();

  }




  // NOTE:    STEP 3 - createTender
  public async s3_createTender() {

    // NOTE: 1- gets user details, and sets all needed newTender Data:



    this.newTender = {

      /*
      Other Properties
      createdAt: Set from Service
      updatedAt:  Set from Service

      tenderCategory: Set from template
      tenderTitle: Set from template
      tenderSummary: Set from template
      tenderContactWhatsapp?: string;
      tenderContactEmail?: string;
      tenderContactNumber?: string;
      deadline: Set from template // this.selectedDeadline,
      attachmentURLs: set in startUpload(),

      participationFee: UNUSED Set from template
      bidBondPercent: UNUSED Set from template
     */
      ...this.newTender,
      tenderId: this.db.afs.createId(),

      uid: this.auth.user.uid,
      creatorEmail: this.auth.user.email,
      profileName: this.auth.user.profileName,
      profileNameAr: this.auth.user.profileNameAr,
      personName: this.auth.user.personName,
      personNumber: this.auth.user.personNumber,
      govSector: this.auth.user.govSector,
      city: this.auth.user.city,

    };


    // NOTE: 2- Uploads newTender with DownloadURLs added to it.
    await this.db.setTS(`tenders/${this.newTender.tenderId}`, this.newTender);

    this.showLoading.dismiss();

    if (this.translate.currentLang === 'ar') {
      this.toast.showToast(`تم إنشاء المناقصة`);
    } else if (this.translate.currentLang === 'en') {
      this.toast.showToast(`Tender Created!`);
    }

    await this.delay(1000);

    this.nav.navigateForward(`/view-tender/${this.newTender.tenderId}`);

    // console.log('After Tender Created Ran');
  }



  // NOTE:
  // NOTE:
  // NOTE:
  // NOTE:
  // NOTE:
  // NOTE:
  // NOTE: Template Related Functions!!!
  // NOTE:


  // NOTE:      setUpload
  // NOTE: OUTPUT: ADDING ALLOWED SELECTED FILES TO fileToUpload[]
  // SAVES DATA OF FILE THAT WAS ADDED FOR LATER. (public since I use it in html)
  public setUpload(event, number) {

    // console.log("setupload", event, number);
    let newFile = event.target.files[0];

    // If no file was selected
    if (newFile == null) {
      this.filesToUpload[number] = 'NOT-SET';
      return;
    }

    let newFileType: string = newFile.type;

    // NOTE: If file is over 10 mbs, then clear the upload button.
    if (newFile.size < 1) {

      if (this.translate.currentLang === 'ar') {
        this.toast.showToast(`الملف الذي إخترته فارغ، الرجاء التحقق`);
      } else if (this.translate.currentLang === 'en') {
        this.toast.showToast(`File Selected is Empty! Please Check File`);
      }

      this.filesToUpload[number] = 'NOT-SET';
      this.myUploadButtons[number].nativeElement.value = '';
    }

    if (newFile.size > 10485760) {
      if (this.translate.currentLang === 'ar') {
        this.toast.showToast(`حجم الملف أكبر من 10 ميجابايت`);
      } else if (this.translate.currentLang === 'en') {
        this.toast.showToast(`File selected is too large! (Max is 10mb)`);
      }
      this.filesToUpload[number] = 'NOT-SET';
      this.myUploadButtons[number].nativeElement.value = '';

      return;
    } else if (

      // NOTE: Else if: Checking if file format is supported:
      //all images (png gif jpg)
      newFileType.includes('image') ||
      //pdf
      newFileType.includes('application/pdf') ||
      //doc
      newFileType.includes('application/msword') ||
      //docx
      newFileType.includes('application/vnd.openxmlformats-officedocument')) {

      // NOTE: IF SELECTED FILE IS VALID THEN ADD
      this.filesToUpload[number] = event;
      // console.log("2:", event);

    } else {
      // NOTE: 3- If file format isn't valid, then clear the upload button.

      if (this.translate.currentLang === 'ar') {
        this.toast.showToast(`صيغة الملف الذي إخترته ليست مدعومة`);
      } else if (this.translate.currentLang === 'en') {
        this.toast.showToast(`File format not Supported! (Only Images/PDF/Word)`);
      }

      this.filesToUpload[number] = 'NOT-SET';
      this.myUploadButtons[number].nativeElement.value = '';

    }

    // console.log(`File ${number} Set:`);
    // console.log(this.filesToUpload[number]);
    return;
  }
  //END: END OF SETUPLOAD!!!


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
    // console.log(this.termsCheckBoxValue);
  }



  private delay(ms: number): any {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  public onSelectDate($event): any {

    // Reference: How to deal with ion-datetime in component!!
    //** START **//
    let tempDateArray = this.selectedDeadline.split('-');

    let day = tempDateArray[2];
    let month = tempDateArray[1];
    let year = tempDateArray[0];

    let tempDate = new Date(Number(year), Number(month), Number(day), 23, 59, 59);

    this.newTender.deadline = new Date(tempDate).getTime();
    //** END **//
    // console.log(this.newTender.deadline);
  }


  // If error, console log and notify user
  private handleError(error: Error) {
    this.showLoading.dismiss();
    console.error(error);
    this.toast.showToast(`${error}`);
  }


  public onTestClicked(): void {

    if (this.s1_validateAndFixInputs()) {
      // console.log("TENDER INPUTS ARE VALID!");
    }
    else {
    }
    // console.log("this.termsCheckBoxValue", this.termsCheckBoxValue)
    // console.log("this.newTender.govSector", this.newTender.govSector)
    // console.log("this.uploadData", this.uploadData);
  }



}
