import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ShowLoadingService } from '../../core/show-loading.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { User, ProfileComment } from '../../../model';
import { FirestoreService } from '../../core/firestore.service';
import { switchMap } from 'rxjs/operators';
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

  public id: string;

  public showComments: boolean = false;

  constructor(
    private nav: NavController,
    private route: ActivatedRoute,
    private loading: ShowLoadingService,
    private db: FirestoreService,
    public auth: AuthService,
  ) { }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('id');

    this.user$ = this.db.doc$<User>(`users/${this.id}`);

    // this.comments$ = this.db.col$<ProfileComment>(`comments`);
    this.comments$ = this.db.col$<ProfileComment>(`comments`, ref => ref.where('commentOnId', '==', this.id));

    this.comments$.subscribe(res => {
      console.log(res);
      this.comments = res;
    });

    this.loading.delay(2000).then(() => {
      this.showComments = true;
    });
  }

  goBack() {
    this.nav.goBack();
  }
}

