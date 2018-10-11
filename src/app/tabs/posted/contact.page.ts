import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Tender, User } from '../../../model';
import { FirestoreService } from '../../core/firestore.service';
import { AuthService } from '../../core/auth.service';
import { ShowLoadingService } from '../../core/show-loading.service';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.page.html',
  styleUrls: ['contact.page.scss']
})
export class ContactPage implements OnInit, OnDestroy {

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
    private loading: ShowLoadingService) {
  }

  ngOnInit() {

    this.loading.presentLoadingDismissAfter(500);

    // NOTE: Subscribing in HTML!
    // this.featuredTenders$ = this.db.col$('tenders', ref => ref.where('featured', '==', true));
    // this.consultantTenders$ = this.db.col$('tenders', ref => ref.where('uid', '==', this.auth.userID));
    // this.contractorTenders$ = this.db.col$('tenders', ref => ref.where('participants', 'array-contains', this.auth.userID));

    // this.featuredTenders$ = this.db.col$('tenders');
    // this.consultantTenders$ = this.db.col$('tenders');
    // this.contractorTenders$ = this.db.col$('tenders');

    this.auth.user$.subscribe(res =>
      this.user = res
    );

    this.tenders$ = this.auth.user$.pipe(
      switchMap(user => {
        if (user != null) {
          switch (user.accountType) {
            case 1:
              return this.db.col$('tenders');
              break;
            case 2:
              return this.db.col$('tenders');
              break;
            case 3:
              return this.db.col$('tenders');
              break;
            case 4:
              return this.db.col$('tenders');
              break;

            default:
              break;
          }
        } else {
          return this.db.col$('tenders');
        }

      }));

    this.tenders$.pipe(takeUntil(this.unsubscribe$)).subscribe(res =>
      this.tenders = res
    );

    // this.loading.delay(700).then(() => this.loading.dismiss());
  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}

/*

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
