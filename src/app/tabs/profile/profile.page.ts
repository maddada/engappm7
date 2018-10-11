import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ShowLoadingService } from '../../core/show-loading.service';
import { ProfileComment, User } from '../../../model';
import { Observable, of } from 'rxjs';
import { Profile } from 'selenium-webdriver/firefox';
import { FirestoreService } from '../../core/firestore.service';
import { take, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  public showNotLoggedIn: boolean = false;
  public showComments: boolean = false;
  public logo: string = 'assets/images/logo/Thuraya.png';
  public comments$: Observable<ProfileComment[]>;
  public comments: ProfileComment[];
  public user: User;

  constructor(public auth: AuthService, private loading: ShowLoadingService, private db: FirestoreService) { }

  /* Another way to get comments, but subscription inside subcription is bad!
    this.auth.user$.subscribe(res => {
      if (res) {
        this.comments$ = this.db.col$<ProfileComment>(`comments`, ref => ref.where('commentOnId', '==', res.uid));

        this.comments$.pipe(take(1)).subscribe(res2 => {
          this.comments = res2;
        });
      } else {
        this.comments$ = of(null);
      }
    });
 */

  ngOnInit() {

    this.comments$ = this.auth.user$.pipe(
      switchMap(res => {
        if (res) {
          console.log('here', res);
          return this.db.col$<ProfileComment>(`comments`, ref => ref.where('commentOnId', '==', res.uid));
        } else {
          return of(null);
        }
      }));

    this.comments$.subscribe(res => this.comments = res);


    this.auth.user$.subscribe(res => {
      this.user = res;
    });


    this.loading.delay(1000).then(() => {
      this.showNotLoggedIn = true;
    });

    this.loading.delay(1000).then(() => {
      this.showComments = true;
    });




  }

}
