import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Observable, Subject, of, forkJoin } from 'rxjs';
import { User, Tender, city, M7LoadingOptions } from '../../../model';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { FirestoreService } from '../../core/firestore.service';
import { switchMap, tap, filter, takeUntil, concatMap, flatMap, mergeMap, map } from 'rxjs/operators';
import { ShowToastService } from '../../core/show-toast.service';
import { LoadingController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],

})
export class Tab1Page implements OnInit, OnDestroy {


  constructor(
    public auth: AuthService,
    private db: FirestoreService,
    private loadingCtrl: LoadingController,
    private toast: ShowToastService,
    private platform: Platform,
    public translate: TranslateService,
  ) {

  }

  tenders: Tender[];
  tenders$: Observable<Tender[]>;
  userWithTenders$: Observable<any>;

  tendersCollection: AngularFirestoreCollection<Tender>;
  tendersAllCities$: Observable<Tender[]>;

  selectedCityString: string;
  selectedCityNumber: number;

  showLoading: any;

  dontRun: boolean;
  firstRun: boolean;

  unsubscribe$: Subject<any> = new Subject();

  async ngOnInit() {

    this.selectedCityString = '0';
    this.selectedCityNumber = 0;
    this.dontRun = false;

    this.firstRun = true;

    this.platform.ready().then(() => {
      this.onSelectCity();
    });

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public async onSelectCity() {

    // To hide big 'Overlay Doesn't Exist' Error.
    this.toast.toastController.dismiss().catch(_ => { });

    if (this.dontRun === true) {
      this.dontRun = false;
      return;
    }

    this.showLoading = await this.loadingCtrl.create(new M7LoadingOptions);
    await this.showLoading.present();

    this.selectedCityNumber = Number(this.selectedCityString);

    // _: If 'All Cities' is selected.
    if (this.selectedCityNumber === 0) {
      this.tenders$ = this.db.col$('tenders', ref => ref.orderBy('deadline', 'desc'));
    }

    else {

      // NOTE: If a specific city is selected.
      // NOTE: OPTIONS ARE:
      // NOTE: #1- NO TENDERS IN SELECTED CITY!
      // NOTE: #2- THERE'S TENDERS IN SELECTED CITY!

      let temp$: Observable<Tender[]>
        = this.db.col$('tenders', ref => ref.where('city', '==', this.selectedCityNumber).orderBy('deadline', 'desc'));

      this.tenders$ = temp$.pipe(
        switchMap(res => {
          const currentTime = new Date().getTime();
          let
            res2 = res;


          // _: #1- NO TENDERS IN SELECTED CITY!
          if (res2.length === 0) {

            this.showNotFoundToast();

            this.dontRun = true;
            this.selectedCityString = '0';
            this.selectedCityNumber = 0;

            return this.db.col$('tenders', ref => ref.orderBy('deadline', 'desc'));
          } else {
            // _: #2- THERE'S TENDERS IN SELECTED CITY!
            return this.db.col$('tenders', ref => ref.where('city', '==', this.selectedCityNumber).orderBy('deadline', 'desc'));
          }
        })
      );

      this.showLoading.dismiss();
    }

    if (this.dontRun) { return; }

    /*
      obs1.pipe(
        mergeMap(event1 => {
          return obs2.map(
            event2 => event1.target.value + ' ' + event2.target.value
          )
        }
      )).subscribe(
        combinedValue => span.textContent = combinedValue
      );
    */

    // LEARNED MERGE MAP!
    this.userWithTenders$ = this.tenders$.pipe(
      takeUntil(this.unsubscribe$),
      mergeMap(res1Tenders => {
        // _: when this emits
        return this.auth.user$.pipe(
          map(res2User => {
            if (res2User) {
              // _: take the last value from tenders$, merge it, and return this new result
              return res1Tenders.filter(resTender => res2User.uid !== resTender.uid);
            } else {
              return res1Tenders;
            }
          })
        );
      })
    );

    this.userWithTenders$.subscribe(res => {
      if (res.length > 0) {
        this.tenders = res;
      } else {
        this.showNotFoundToast();
        this.dontRun = true;
        this.selectedCityString = '0';
        this.selectedCityNumber = 0;
      }
      this.showLoading.dismiss();
    });

    /*
        this.userWithTenders$ = this.auth.user$.pipe(
          takeUntil(this.unsubscribe$),
          mergeMap(res1User => {
            if (res1User != null) {
              return this.tenders$.pipe(
                  map(res2Tenders => {
                      return res2Tenders.filter(resTender => this.auth.user.uid !== resTender.uid);
                  }));
            } else {
              return this.tenders$;
            }
          }),
        );
    */


    // when inner obs emits it'll merge it with outer
    // make inner tenders$
    // make outer user






    // WORKING OLD SUB!
    // this.tenders$.subscribe(resTenders => {
    //   if (this.auth.user != null && this.auth.user.uid != null) {
    //     this.tenders = resTenders.filter(resTender => {
    //       return this.auth.user.uid !== resTender.uid;
    //     });
    //   } else {
    //     this.tenders = resTenders;
    //   }

    //   // LATER: Make it filter out ended tenders
    //   this.showLoading.dismiss();
    // });


  }

  showNotFoundToast() {

    if (this.translate.currentLang === 'en') {
      // Simple: Just shows toast saying 'no tenders found'
      switch (this.selectedCityNumber) {
        case city.dxb:
          this.toast.showToast('No ongoing tenders were found in Dubai');
          break;
        case city.shj:
          this.toast.showToast('No ongoing tenders were found in Sharjah');
          break;
        case city.ad:
          this.toast.showToast('No ongoing tenders were found in Abu Dhabi');
          break;
        case city.ajman:
          this.toast.showToast('No ongoing tenders were found in Ajman');
          break;
        case city.rak:
          this.toast.showToast('No ongoing tenders were found in Ras Al Khaima');
          break;
        case city.umq:
          this.toast.showToast('No ongoing tenders were found in Um Al Quwain');
          break;
        case city.fujaira:
          this.toast.showToast('No ongoing tenders were found in Fujaira');
          break;
        default:
          break;
      }
    }

    if (this.translate.currentLang === 'ar') {
      // Simple: Just shows toast saying 'no tenders found'
      switch (this.selectedCityNumber) {
        case city.dxb:
          this.toast.showToast('لم يتم العثور على أي مناقصات في دبي');
          break;
        case city.shj:
          this.toast.showToast('لم يتم العثور على أي مناقصات في الشارقة');
          break;
        case city.ad:
          this.toast.showToast('لم يتم العثور على أي مناقصات في أبوظبي');
          break;
        case city.ajman:
          this.toast.showToast('لم يتم العثور على أي مناقصات في عجمان');
          break;
        case city.rak:
          this.toast.showToast('لم يتم العثور على أي مناقصات في راس الخيمة');
          break;
        case city.umq:
          this.toast.showToast('لم يتم العثور على أي مناقصات في أم القيوين');
          break;
        case city.fujaira:
          this.toast.showToast('لم يتم العثور على أي مناقصات في الفجيرة');
          break;
        default:
          break;
      }
    }
  }

  async delay(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}

// LATER: Make it filter out ended tenders
          /* Add this to all '= res' in subscriptions above:
            const currentTime = new Date().getTime();
            this.tender = res.filter(element => {
              return (element.deadline > currentTime);
             });
          */


  /* LATER: maybe make it show the user's city on log in
    this.tenders$ = this.auth.user$.pipe(
      switchMap(user => {

        if (user != null) {
          this.selectedCityString = '' + user.city;
          this.selectedCityNumber = user.city;

          return this.db.col$('tenders', ref => ref.where('city', '==', user.city).orderBy('createdAt', 'desc'));
        } else {
          this.selectedCityString = "0";
          this.selectedCityNumber = 0;
          return this.db.col$('tenders', ref => ref.orderBy('createdAt', 'desc'));
        }
      })
    );
  */
