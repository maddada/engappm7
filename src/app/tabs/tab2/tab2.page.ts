import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Tender, User } from '../../../model';
import { FirestoreService } from '../../core/firestore.service';
import { AuthService } from '../../core/auth.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {

  // featuredTenders$: Observable<Tender[]>; // for not logged in & supplier
  // consultantTenders$: Observable<Tender[]>; // for consultant
  // contractorTenders$: Observable<Tender[]>; // for contractor

  tenders$: Observable<Tender[]>; // for contractor
  tenders: Tender[]; // for contractor

  user: User;

  unsubscribe$: Subject<any> = new Subject();
  // featuredCompanies$: Observable<Tender[]>; // for indvidual

  constructor(
    public auth: AuthService,
    private db: FirestoreService,
    private loadingCtrl: LoadingController,
    public translate: TranslateService) {
  }

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

    // NOTE: Subscribing in HTML!
    // this.featuredTenders$ = this.db.col$('tenders', ref => ref.where('featured', '==', true));
    // this.consultantTenders$ = this.db.col$('tenders', ref => ref.where('uid', '==', this.auth.userID));
    // this.contractorTenders$ = this.db.col$('tenders', ref => ref.where('participants', 'array-contains', this.auth.userID));

    // this.featuredTenders$ = this.db.col$('tenders');
    // this.consultantTenders$ = this.db.col$('tenders');
    // this.contractorTenders$ = this.db.col$('tenders');

    this.tenders$ = this.auth.user$.pipe(
      switchMap(user => {
        if (user != null) {
          this.user = user;
          switch (user.accountType) {
            case 1: // indvizdual - featured
              return this.db.col$('tenders', ref => ref.where('featured', '==', true).orderBy('deadline', 'desc'));
            case 2: // consultant - posted by user
              return this.db.col$('tenders', ref => ref.where('uid', '==', user.uid).orderBy('deadline', 'desc'));
            case 3: // contractor - featured
              return this.db.col$('tenders', ref => ref.where('featured', '==', true).orderBy('deadline', 'desc'));
            case 4: // supplier - featured
              return this.db.col$('tenders', ref => ref.where('featured', '==', true).orderBy('deadline', 'desc'));
            // no need for break cuz they all return!
            default:
              break;
          }
        } else {
          return this.db.col$('tenders', ref => ref.where('featured', '==', true).orderBy('deadline', 'desc'));
        }

      }));

    this.tenders$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.tenders = res;
      showLoading.dismiss();
    });

    // this.loading.delay(700).then(() => this.loading.dismiss());
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

/*
    // NOTE: Managing a bunch of observables in html is annoying. and it was also giving me weird behaviour sometimes.
    // NOTE: Always sub in .ts
    // NOTE: Was using switchmap to get observable based on user.uid, but I went to having 2 subscriptions in the HTML..
    // NOTE: .. 1 for the user and one for the tender. (tender's observable changes based on usertype)
        this.tenders$ = this.auth.afAuth.authState.pipe(
      switchMap(user => {
            if (user) {
              return this.db.col$('tenders', ref => ref.where('uid', '==', user.uid));
              // this.afs.doc<User>(`users/${user.uid}`).valueChanges();
            } else {
              return of(null);
            }
      }),
    );
*/
