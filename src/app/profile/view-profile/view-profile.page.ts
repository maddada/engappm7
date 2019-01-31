import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { ShowLoadingService } from '../../core/show-loading.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { User, ProfileComment } from '../../../model';
import { FirestoreService } from '../../core/firestore.service';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/auth.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.page.html',
  styleUrls: ['./view-profile.page.scss'],
})
export class ViewProfilePage implements OnInit, OnDestroy {

  public user$: Observable<User>;
  public comments$: Observable<ProfileComment[]>;
  public comments: ProfileComment[];
  public company: User;

  public id: string;

  public showComments: boolean = false;
  public showProfile: boolean = false;



  unsubscribe$: Subject<any> = new Subject();

  constructor(
    private nav: NavController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private db: FirestoreService,
    public auth: AuthService,
    public translate: TranslateService,
  ) { }

  async ngOnInit() {



    const showLoading = await this.loadingCtrl.create({
      translucent: false,
      spinner: "bubbles",
      showBackdrop: true,
      animated: true,
      keyboardClose: true,
      mode: "md",
    });
    await showLoading.present();

    this.id = this.route.snapshot.paramMap.get('id');

    this.user$ = this.db.doc$<User>(`users/${this.id}`);
    this.comments$ = this.db.col$<ProfileComment>(`comments`, ref => ref.where('commentOnId', '==', this.id));

    this.user$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.company = res;
    });

    await this.comments$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      // console.log(res);
      this.comments = res;

      this.showProfile = true;
      this.showComments = true;

      showLoading.dismiss();
    });

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  goBack() {
    this.nav.goBack();
  }
}

