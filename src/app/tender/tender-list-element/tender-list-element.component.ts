import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Tender } from '../../../model';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { File } from '@ionic-native/file/ngx';
import { HttpClient } from '@angular/common/http';
import { toPromise } from 'rxjs/Operator/toPromise';
import { AngularFireStorage } from '@angular/fire/storage';

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
    public http: HttpClient,
    public storage: AngularFireStorage
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
    console.log({_attachmentUrl})
    // The code asumes you have the native File plugin injected and the instance is called "file"
    var httpsReference = this.storage.storage.refFromURL(_attachmentUrl);
    console.log({httpsReference})
    debugger
    httpsReference.getDownloadURL().then(res => {
      this.http.get(res, { responseType: 'blob' })
        .subscribe((fileBlob: Blob) => {
          // imageBlob is the binary data of the the image
          // From here you can manipulate it and store it where you want
          // For example, to store it in your app dir
          // The replace true is optional but is just in case you want to overwrite it
          return this.file.writeFile(this.file.dataDirectory, "attachment_" + this.randomNumber(), fileBlob, { replace: true });
        });
    });

  }

}