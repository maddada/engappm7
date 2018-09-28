import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { FirestoreService } from '../../core/firestore.service';

import { Tender, User } from '../../../model';

import { Observable } from 'rxjs';
import { finalize, take, map } from 'rxjs/operators';
import { ShowToastService } from '../../core/show-toast.service';
import { NavController } from '@ionic/angular';

import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-create-tender',
  templateUrl: './create-tender.page.html',
  styleUrls: ['./create-tender.page.scss'],
})
export class CreateTenderPage implements OnInit {

  public user: User;
  public newTender: Tender = {};

  protected uploadPercent: Observable<number>;
  protected downloadURL: Observable<string>;

  protected selectedDeadline: any;
  protected selectedTenderCategory: string;

  private newTenderDoc: AngularFirestoreDocument<Tender>;

  private filesToUpload: any[] = []; //Accepted Files

  termsCheckBoxValue: boolean;
  datePickerMinYear: number;
  datePickerMaxYear: number;

  // For On Change Selected, converted to number newTender.numOfAttachments

  // Used to access input and clear it
  // (if file selected for upload is too big or disallowed type)
  // Use 1 2 3 in UI ONLY! Everywhere else use 0 1 2 to avoid confusion.
  @ViewChild('uploadButton0')
  private myUploadButton0: ElementRef;

  @ViewChild('uploadButton1')
  private myUploadButton1: ElementRef;

  @ViewChild('uploadButton2')
  private myUploadButton2: ElementRef;






  constructor(
    private nav: NavController,
    // private afAuth: AngularFireAuth,
    // private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private db: FirestoreService,
    private auth: AuthService,
    private toast: ShowToastService,
    public element: ElementRef,
  ) {

  }



  ngOnInit() {
    this.setMinMaxYear();

    this.newTender.participationFee = 0;
    this.newTender.bidBondPercent = 0;

    this.newTender.attachmentURLs = [];

  }



  protected setMinMaxYear() {
    let temp = new Date();

    this.datePickerMaxYear = temp.getFullYear() + 1;
    this.datePickerMinYear = temp.getFullYear();
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

    // FIXME: ADD FILE UPLOADING!!
    // if (this.newTender.numOfAttachments !== 0) {
    //   this.uploadFiles();
    // }

    this.auth.user$.pipe(
      take(1),
      map(user =>
        this.user = user
      )).subscribe();

    this.newTender = {
      //createdAt?: any; FROM AUTH
      //updatedAt?: any; FROM AUTH
      tenderId: this.db.afs.createId(),

      //tenderCategory :// SET ALREADY

      //tenderTitle SET ALREADY
      //tenderSummary: SET ALREADY

      deadline: this.selectedDeadline,

      uid: this.user.uid,
      creatorEmail: this.user.email,
      companyName: this.user.companyName,
      personName: this.user.personName,
      personNumber: this.user.personNumber,
      govSector: this.user.govSector,
      city: this.user.city,

      //participationFee: // SET ALREADY
      //bidBondPercent?: number; // SET ALREADY

      participants: [],

      // FIXME: ATTACHMENTS LATER:
      // attachmentURLs?: string[],

      //NOTE META
      numberOfProposals: 0,
    };

    // NOTE: WORKING HERE!!!
    this.db.setTS(`tenders/${this.newTender.tenderId}`, this.newTender);

  }

  // NOTE:    3- onTestClicked
  protected onTestClicked(): void {

    if (this.validateInputs()) {
      console.log("TEST ADD TENDER SUCCESSFUL!");
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
    // TODO: CHECK INPUTS FOR CREATE TENDER

    // FIXME: VALIDATE INPUTS
    if (
      this.newTender.tenderTitle == null ||
      this.newTender.tenderTitle.length === 0 ||
      this.newTender.tenderSummary == null ||
      this.newTender.tenderSummary.length === 0 ||
      isNaN(this.newTender.bidBondPercent)
    ) {
      console.log("stopped here");
      this.toast.showToast(`A Required Field is Empty!`);
      return false;
    }
    return true;
  }




  // NOTE:      setUpload
  // NOTE: OUTPUT: ADDING ALLOWED SELECTED FILES TO fileToUpload[]
  // SAVES DATA OF FILE THAT WAS ADDED FOR LATER. (protected since I use it in html)
  protected setUpload(event, number) {

    console.log("setupload", event, number);
    let newFile = event.target.files[0];

    // If no file was selected
    if (newFile == null) {
      return;
    }

    let newFileType: string = newFile.type;

    // checking if file is compatible
    // If file is over 10 mbs
    if (newFile.size > 10485760) {
      this.toast.showToast(`File selected is too large! (Max is 10mb)`);

      switch (number) {
        case 0: {
          this.myUploadButton0.nativeElement.value = '';
          break;
        }
        case 1: {
          this.myUploadButton1.nativeElement.value = '';
          break;
        }
        case 2: {
          this.myUploadButton2.nativeElement.value = '';
          break;
        }
      }

      return;
    } else if (
      // Else if file is one of these formats, add it to the filesToUpload array

      //all images (png gif jpg)
      newFileType.includes('image') ||
      //pdf
      newFileType.includes('application/pdf') ||
      //doc
      newFileType.includes('application/msword') ||
      //docx
      newFileType.includes('application/vnd.openxmlformats-officedocument')) {

      this.filesToUpload[number] = event;
      console.log("2:", event);

    } else { // if it's not one of the formats then don't upload it

      this.toast.showToast(`File format not Supported! (Only Images/PDF/Word)`);

      switch (number) {
        case 0: {
          this.myUploadButton0.nativeElement.value = '';
          break;
        }
        case 1: {
          this.myUploadButton1.nativeElement.value = '';
          break;
        }
        case 2: {
          this.myUploadButton2.nativeElement.value = '';
          break;
        }
        default: {
          console.log("default");
        }
      }
    }

    console.log(`File ${number} Set:`);
    console.log(this.filesToUpload[number]);
    return;
  }
  //END: END OF SETUPLOAD!!!


  // NOTE: Upload Files
  uploadFiles() {
    for (let i = 1; i <= this.filesToUpload.length; i++) {
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
    const filePath = `users/${this.newTender.uid}/${this.newTender.tenderId}`;
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

  // protected onSelectNumOfAttachments($event): any {
  //   this.newTender.numOfAttachments = Number(this.selectedNumOfAttachmentsString);
  // }

  protected onSelectDate($event): any {
    console.log(this.selectedDeadline);
    // this.newTender.deadline = Number(this.selectedNumOfAttachmentsString);
  }



  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    this.toast.showToast(`${error}`);
  }


}
