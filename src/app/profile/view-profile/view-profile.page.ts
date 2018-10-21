import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { ShowLoadingService } from '../../core/show-loading.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { User, ProfileComment, M7LoadingOptions } from '../../../model';
import { FirestoreService } from '../../core/firestore.service';
import { switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.page.html',
  styleUrls: ['./view-profile.page.scss'],
})
export class ViewProfilePage implements OnInit {

  public user$: Observable<User>;
  public comments$: Observable<ProfileComment[]>;
  public comments: ProfileComment[];
  public company: User;

  public id: string;

  public showComments: boolean = false;
  public showProfile: boolean = false;

  constructor(
    private nav: NavController,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private db: FirestoreService,
    public auth: AuthService,
  ) { }

  async ngOnInit() {

    const showLoading = await this.loadingCtrl.create(new M7LoadingOptions);
    await showLoading.present();

    this.id = this.route.snapshot.paramMap.get('id');

    this.user$ = this.db.doc$<User>(`users/${this.id}`);
    this.comments$ = this.db.col$<ProfileComment>(`comments`, ref => ref.where('commentOnId', '==', this.id));

    this.user$.pipe(take(1)).subscribe(res => {
      console.log(res);
      this.company = res;
    });

    await this.comments$.pipe(take(1)).subscribe(res => {
      console.log(res);
      this.comments = res;

      this.showProfile = true;
      this.showComments = true;

      showLoading.dismiss();
    });

  }

  goBack() {
    this.nav.goBack();
  }
}

