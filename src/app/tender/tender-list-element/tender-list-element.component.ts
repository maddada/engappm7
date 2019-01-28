import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Tender } from '../../../model';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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

  constructor(private nav: NavController,
    public translate: TranslateService) {
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
}
