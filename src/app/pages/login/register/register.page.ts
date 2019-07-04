import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireAuth } from '@angular/fire/auth';

import { FirestoreService } from '../../../core/firestore.service';

import { User } from '../../../../model';

import { Observable } from 'rxjs';
import { finalize, take } from 'rxjs/operators';
import { ShowToastService } from '../../../core/show-toast.service';
import { NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

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
        private loadingCtrl: LoadingController,
        private route: ActivatedRoute,
        public translate: TranslateService,
    ) {

    }

    public newUser: User = { accountType: -1 };
    public uploadPercent: Observable<any>;
    public downloadURL: Observable<string>;

    private uploadData: any;

    private selectedFile: any;

    private newUserDoc: AngularFirestoreDocument<User>;

    private selectedSupplierCategories: string[] = [];

    // We're binding to a select to get these
    // We're recieving them as string
    // Later do this:
    // this.newUser.city = Number(this.selectedCity);
    // to convert from string to number
    public selectedCity: string;
    public selectedClass: string;

    public selectedType: string;

    public selectedSector: string;

    termsCheckBoxValue: boolean;

    showLoading: any;


    // used to access input and clear it
    // (if file selected for upload is too big or disallowed type)
    @ViewChild('uploadButton')
    private myUploadButton: ElementRef;

    ngOnInit() {



        let type = Number(this.route.snapshot.paramMap.get('type'));

        if (type != null && type > 0 && type <= 4) {
            this.newUser.accountType = type;
            this.selectedType = '' + type;
        } else {
            this.newUser.accountType = -1;
            this.selectedType = null;
        }

        this.newUser.tags = []; // You have to initialize arrays before pushing to them!
    }



    public async onSubmit() {

        this.toast.toastController.dismiss().catch(_ => { });

        if (this.validateInputs()) {
            this.emailSignUp();
        }
        else {
            return;
        }
    }

    public onTestClicked(): void {

        if (this.validateInputs()) {
            // console.log("TEST REGISTRATION SUCCESSFUL!");
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
            // console.log("stopped here");
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
                    // console.log("stopped here");
                    return false;
                }
            // tslint:disable-next-line
            case 3: {
                if (
                    isNaN(this.newUser.city) ||
                    this.newUser.profileName == null ||
                    this.newUser.profileName.length === 0 ||
                    this.newUser.companyNumber == null ||
                    this.newUser.companyNumber.length === 0 ||
                    isNaN(this.newUser.class) ||
                    this.uploadData == null) {
                    // console.log("stopped here");
                    this.toast.showToast(`A Required Field is Empty!`);
                    return false;
                } else {
                    return true;
                }
            }

            case 4: {
                if (
                    isNaN(this.newUser.city) ||
                    this.newUser.profileName == null ||
                    this.newUser.profileName.length === 0 ||
                    this.newUser.companyNumber == null ||
                    this.newUser.companyNumber.length === 0 ||
                    this.newUser.tags.length === 0 ||
                    this.uploadData == null) {
                    // console.log("stopped here");
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

    private async emailSignUp() {
        this.showLoading = await this.loadingCtrl.create({
            translucent: false,
            spinner: "bubbles",
            showBackdrop: true,
            animated: true,
            keyboardClose: true,
            mode: "md",
        });
        await this.showLoading.present();

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
            .catch(error => {
                this.handleError(error);
            });
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
                this.newUser.tags.push('dxb');
                break;

            case 2:
                this.newUser.tags.push('shj');
                break;

            case 3:
                this.newUser.tags.push('ajman');
                break;

            case 4:
                this.newUser.tags.push('ad');
                break;

            case 5:
                this.newUser.tags.push('ain');
                break;

            case 6:
                this.newUser.tags.push('fujaira');
                break;

            case 7:
                this.newUser.tags.push('rak');
                break;

            case 8:
                this.newUser.tags.push('umq');
                break;

            default:
                break;
        }
    }



    // SAVES DATA OF FILE THAT WAS ADDED FOR LATER. (public since I use it in html)
    // This is used in the template, dw about no reference found
    public setUpload(event) {

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
        // console.log(this.uploadData);

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
        // console.log(current_date);

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
                    take(1), // keep this take(1)
                    finalize(() => {
                        this.afterUserRegistered();
                    })

                ).subscribe((val) => {
                    this.newUser.licenceURL = val;

                    // console.log(`this.newUser.licenceURL:`, this.newUser.licenceURL);
                });
            })

        ).subscribe();
    }


    showTerms() {
        window.open(`https://memar.ae/privacy/`, '_blank');
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
        // console.log(this.termsCheckBoxValue);
    }





    private delay(ms: number): any {
        return new Promise(resolve => setTimeout(resolve, ms));
    }



    private async afterUserRegistered() {

        await this.db.setTS(this.newUserDoc, this.newUser);


        this.showLoading.dismiss();

        this.toast.showToast(`Registration Successful, Welcome!`);
        // console.log('AFTER USER REGISTERED RAN');



        await this.delay(1500);

        this.nav.navigateForward('/');
    }


    public onSelectType($event): any {
        this.newUser.accountType = Number(this.selectedType);
    }



    public onSelectCity($event): any {
        this.newUser.city = Number(this.selectedCity);
    }

    public onSelectClass($event): any {
        this.newUser.class = Number(this.selectedClass);
    }


    public onSelectSector($event): any {
        if (this.selectedSector === "gov") {
            this.newUser.govSector = true;
        }
        else if (this.selectedSector === "private") {
            this.newUser.govSector = false;
        }
    }


    public onSelectSupplierCategory($event): any {

        if ($event.detail.value.length > 0) {
            this.selectedSupplierCategories = $event.detail.value;
            this.newUser.tags = [... this.selectedSupplierCategories];
        }

    }


    // console.log(event);
    // array that has all selected element's values:
    // ex: ["c_blocks", "c_ceramics", "c_interlock"]
    // Working
    // console.log(event.detail.value);
    // Upload this to each supplier document as
    // _tags array and it'll be used for
    // searching using algolia later.



    // If error, console log and notify user
    private handleError(error: Error) {
        this.showLoading.dismiss();
        console.error(error);
        this.toast.showToast(`${error}`);
    }



}
// END OF FILE HERE






