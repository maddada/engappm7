import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Tender } from '../../../model';
import { NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { File } from '@ionic-native/file/ngx';
import { HttpClient } from '@angular/common/http';
import { toPromise } from 'rxjs/Operator/toPromise';
import { AngularFireStorage } from '@angular/fire/storage';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';

@Component({
    selector: 'app-tender-list-element',
    templateUrl: './tender-list-element.component.html',
    styleUrls: ['./tender-list-element.component.scss']
})
export class TenderListElementComponent implements OnInit, OnDestroy {

    @Input() tender: Tender;
    @Input() extended: boolean;

    public statusString: string;
    public publishedString: string;

    public publishedDate: Date;

    unsubscribe$: Subject<any> = new Subject();

    constructor(
        private nav: NavController,
        public translate: TranslateService,
        public file: File,
        public storage: AngularFireStorage,
        public platform: Platform,
        public transfer: FileTransfer,
        public fileOpener: FileOpener
    ) {
    }

    ngOnInit() {
        this.publishedDate = this.tender.createdAt.toDate();

        this.setStatus();
        this.translate.onLangChange.pipe(takeUntil(this.unsubscribe$)).subscribe(_ => {
            this.setStatus();
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    public viewTender() {
        if (!this.extended) {
            this.nav.navigateForward(`/view-tender/${this.tender.tenderId}`);
        }
    }

    public setStatus() {
        let today = new Date().getTime();
        let deadline = this.tender.deadline;

        // console.log(5, today);
        // how many days to deadline.
        let diffToDeadline = deadline - today;
        // console.log('diffToDeadline:', diffToDeadline);
        // how many days since published.

        let diffToPublished = today - this.publishedDate.getTime();
        // console.log(8, diffToPublished);

        //2 days:
        // 172800000
        // 5 days:
        // 432000000
        // NOTE: if less than 5 days left
        if (diffToDeadline > 0 && diffToDeadline < 432000000) {
            if (this.translate.currentLang === 'ar') {
                this.statusString = "شارف الإنتهاء";
            } else if (this.translate.currentLang === 'en') {
                this.statusString = "Ending Soon";
            }
        }

        // NOTE: if more than 5 days left
        // NOTE: started less than 2 days ago.
        if (diffToDeadline > 432000000 && diffToPublished < 172800000) {
            if (this.translate.currentLang === 'ar') {
                this.statusString = "جديد";
            } else if (this.translate.currentLang === 'en') {
                this.statusString = "New";
            }
        }

        // NOTE: if more than 5 days left
        if (diffToDeadline > 432000000) {
            if (this.translate.currentLang === 'ar') {
                this.statusString = "جاري";
            } else if (this.translate.currentLang === 'en') {
                this.statusString = "Ongoing";
            }
        }

        // NOTE: if it's done!
        if (diffToDeadline < 0) {
            if (this.translate.currentLang === 'ar') {
                this.statusString = "إنتهى";
            } else if (this.translate.currentLang === 'en') {
                this.statusString = "Ended";
            }
        }
    }

    randomNumber(): number {
        return Math.floor(Math.random() * 100); // from 0 to 99
    }

    downloadAttachment(_attachmentUrl: string) {
        //TODO: MAKE THIS IOS
        if (this.platform.is('ios')) {
            // if (0 === 0) {
            // !! Assumes variable fileURL contains a valid URL to a path on the device,
            //    for example, cdvfile://localhost/persistent/path/to/downloads/

            const fileTransfer: FileTransferObject = this.transfer.create();

            let _fileName = '';
            let _meta = '';

            if (_attachmentUrl.includes('.pdf')) {
                _fileName = 'tender_attachment.pdf';
                _meta = 'application/pdf';
            }
            else if (_attachmentUrl.includes('.docx')) {
                _fileName = 'tender_attachment.docx';
                _meta = 'application/vnd.openxmlformats-officedocument';
            }
            else if (_attachmentUrl.includes('.doc')) {
                _fileName = 'tender_attachment.doc';
                _meta = 'application/msword';
            }
            else if (_attachmentUrl.includes('.png')) {
                _fileName = 'tender_attachment.png';
                _meta = 'image/png';
            }
            else if (_attachmentUrl.includes('.jpg')) {
                _fileName = 'tender_attachment.jpg';
                _meta = 'image/jpeg';
            }
            else if (_attachmentUrl.includes('.gif')) {
                _fileName = 'tender_attachment.gif';
                _meta = 'image/gif';
            }
            else if (_attachmentUrl.includes('.ppt')) {
                _fileName = 'tender_attachment.ppt';
                _meta = 'application/vnd.ms-powerpoint';
            }

            debugger
            fileTransfer.download(_attachmentUrl, this.file.dataDirectory + _fileName, false
                // ,{
                //     headers: {
                //         "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                //     }
                // }
            ).then(entry => {
                console.log("download complete: " + entry.toURL());
                console.log({ entry });

                this.fileOpener.showOpenWithDialog(entry.toURL(), _meta)
                    .then(() => console.log('File is opened'))
                    .catch(e => console.log('Error opening file', e));
                debugger
            }).catch(function (error) {
                console.log("download error source: " + error.source);
                console.log("download error target: " + error.target);
                console.log("download error code: " + error.code);
                debugger
            });

            //// THIS S DOESN'T WORK!
            //     console.log({ _attachmentUrl });
            //     // The code asumes you have the native File plugin injected and the instance is called "file"
            //     let httpsReference = this.storage.storage.refFromURL(_attachmentUrl);
            //     console.log({ httpsReference });

            //     debugger
            //     httpsReference.getDownloadURL().then(res => {
            //         debugger
            //         this.http.get(res, { responseType: 'blob' })
            //             .subscribe((fileBlob: Blob) => {
            //                 debugger
            //                 // imageBlob is the binary data of the the image
            //                 // From here you can manipulate it and store it where you want
            //                 // For example, to store it in your app dir
            //                 // The replace true is optional but  is just in case you want to overwrite it
            //                 return this.file.writeFile(this.file.dataDirectory, res.name, fileBlob, { replace: true });
            //             });
            //     });
        } else {
            //android chrome
            window.open(_attachmentUrl, '_blank');
        }
    }

}
