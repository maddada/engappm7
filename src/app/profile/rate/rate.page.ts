import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileComment, User } from '../../../model';
import { AuthService } from '../../core/auth.service';
import { ShowToastService } from '../../core/show-toast.service';
import { FirestoreService } from '../../core/firestore.service';
import { take } from 'rxjs/operators';
import { ShowLoadingService } from '../../core/show-loading.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.page.html',
  styleUrls: ['./rate.page.scss'],
})
export class RatePage implements OnInit {

  id: string;
  onUser: User;

  newComment: ProfileComment;
  selectedRating: string;

  constructor(private route: ActivatedRoute, public auth: AuthService, private toast: ShowToastService, private db: FirestoreService,
    private loading: ShowLoadingService, private nav: NavController) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.newComment = {};
    this.newComment.rating = -1;

    this.db.doc$(`users/${this.id}`).pipe(take(1)).subscribe(res =>
      this.onUser = res
    );
  }


  public onSelectRating($event): any {
    this.newComment.rating = Number(this.selectedRating);
  }

  onSubmit() {
    this.s1_validateAndStart();
  }

  s1_validateAndStart() {
    // Validate:
    if (
      this.newComment.commentStr == null ||
      this.newComment.commentStr.length === 0 ||
      this.newComment.rating === -1
    ) {
      this.toast.showToast(`A Required Field is Empty!`, '', 2000);
      return;
    } else {
      this.loading.presentLoadingDismissAfter(1500);
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

    this.db.upsertTS(`comments/${this.newComment.createdById}_${this.newComment.commentOnId}`, this.newComment);

    this.loading.delay(2500).then(() => {
      this.toast.showToast(`Rating Submitted for ${this.newComment.commentOnName}`);
      this.nav.goBack();
    });
  }

  goBack() {
    this.nav.goBack();
  }
}

