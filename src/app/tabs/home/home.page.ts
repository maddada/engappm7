import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from '../../core/auth.service';
import { Observable, Subject } from 'rxjs';
import { User, Tender, city } from '../../../model';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { FirestoreService } from '../../core/firestore.service';
import { ShowLoadingService } from '../../core/show-loading.service';
import { map, take, switchMap, tap, takeUntil } from 'rxjs/operators';
import { ShowToastService } from '../../core/show-toast.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  tenders: Tender[];
  tenders$: Observable<Tender[]>;
  tendersCollection: AngularFirestoreCollection<Tender>;
  tendersAllCities$: Observable<Tender[]>;

  user$: Observable<User | null>;

  unsubscribe$: Subject<any> = new Subject();

  selectedCityString: string;
  selectedCityNumber: number;

  constructor(
    public auth: AuthService,
    private db: FirestoreService,
    private loading: ShowLoadingService,
    private toast: ShowToastService,
    private menuCtrl: MenuController,
    private nav: NavController,
  ) {

  }

  ngOnInit() {

    this.loading.presentLoadingDismissAfter(700);

    this.tenders$ = this.auth.user$.pipe(
      switchMap(user => {
        if (user != null) {
          this.selectedCityString = '' + user.city;

          return this.db.col$('tenders', ref => ref.where('city', '==', 3).orderBy('createdAt', 'desc'));
        } else {

          this.selectedCityString = "0";
          return this.db.col$('tenders', ref => ref.where('city', '==', 3).orderBy('createdAt', 'desc'));
        }
      }),
      tap(res => this.tenders = res));

    this.tenders$.pipe(takeUntil(this.unsubscribe$)).subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  //ionViewWillEnter() {} //DOESN'T WORKWELL, Only loads on first time!

  public onSelectCity($event): any {

    this.loading.presentLoadingDismissAfter(700);

    this.selectedCityNumber = Number(this.selectedCityString);

    if (this.selectedCityNumber === 0) {
      this.tenders$ = this.db.col$('tenders', ref => ref.orderBy('createdAt', 'desc'));
    }
    else {
      // NOTE: If a specific city is selected:
      this.tenders$ = this.db.col$('tenders', ref => ref.where('city', '==', this.selectedCityNumber).orderBy('createdAt', 'desc'));

      // NOTE: If there are no tenders in that city:
      this.tenders$.pipe(
        take(1),
        map(res => {
          if (res.length === 0) {
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
                this.toast.showToast('No ongoing tenders were found in Umm Al Quwain');
                break;
              case city.fujaira:
                this.toast.showToast('No ongoing tenders tenders were found in  Fujairah');
                break;

              default:
                break;
            }

            this.loading.delay(200).then(xd => {
              this.selectedCityString = '0';
              this.selectedCityNumber = 0;
            });
          }
        })
      ).subscribe();
    }
  }

}
