import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileComment, User } from '../../../model';
import { AuthService } from '../../core/auth.service';
import { ShowToastService } from '../../core/show-toast.service';
import { FirestoreService } from '../../core/firestore.service';
import { takeUntil } from 'rxjs/operators';
import { NavController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.page.html',
  styleUrls: ['./rate.page.scss'],
})
export class RatePage implements OnInit, OnDestroy {

  id: string;
  onUser: User;

  newComment: ProfileComment;
  selectedRating: string;

  showLoading: any;


  unsubscribe$: Subject<any> = new Subject();

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private toast: ShowToastService,
    public translate: TranslateService,
    private db: FirestoreService,
    private nav: NavController,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {



    this.id = this.route.snapshot.paramMap.get('id');

    this.newComment = {};
    this.newComment.rating = -1;

    this.db.doc$(`users/${this.id}`).pipe(takeUntil(this.unsubscribe$)).subscribe(res =>
      this.onUser = res
    );
  }


  public onSelectRating($event): any {
    this.newComment.rating = Number(this.selectedRating);
  }

  onSubmit() {
    this.s1_validateAndStart();
  }

  async s1_validateAndStart() {
    // Validate:
    if (
      this.newComment.commentStr == null ||
      this.newComment.commentStr.length === 0 ||
      this.newComment.rating === -1
    ) {
      if (this.translate.currentLang === 'ar') {
        this.toast.showToast(`الرجاء تعبئة الخانات الإلزامية`);
      } else if (this.translate.currentLang === 'en') {
        this.toast.showToast(`A Required Field is Empty!`);
      }

      return;
    } else {

      this.showLoading = await this.loadingCtrl.create({
        translucent: false,
        spinner: "bubbles",
        showBackdrop: true,
        animated: true,
        keyboardClose: true,
        mode: "md",
      });
      await this.showLoading.present();

      this.s2_createComment();
    }
  }

  s2_createComment() {
    this.newComment.commentStr = this.newComment.commentStr.replace(/\n/g, '. ');

    this.newComment = {
      // createdAt?: set by db service;
      // updatedAt?: set by db service;
      ...this.newComment,
      createdById: this.auth.user.uid,
      creatorDisplayName: this.auth.user.profileName || this.auth.user.personName,
      creatorEmail: this.auth.user.email,
      creatorPhoneNumber: this.auth.user.companyNumber,
      city: this.auth.user.city,

      commentOnId: this.id,
      commentOnName: this.onUser.profileName || this.onUser.personName,
      commentOnCity: this.onUser.city,
      commentOnNumber: this.onUser.companyNumber,
      commentOnEmail: this.onUser.email,
      // commentStr: set by template,
      // rating: set by template,
    };

    this.db.upsertTS(`comments/${this.newComment.createdById}_${this.newComment.commentOnId}`, this.newComment).then(() => {
      this.showLoading.dismiss();
      if (this.translate.currentLang === 'ar') {
        this.toast.showToast(`تم تثبيت التقييم`);
      } else if (this.translate.currentLang === 'en') {
        this.toast.showToast(`Rating Submitted for ${this.newComment.commentOnName}`);
      }

      this.nav.back();
    });
  }

  goBack() {
    this.nav.back();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}

