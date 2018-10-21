import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Observable, Subject } from 'rxjs';
import { User, Tender, city, M7LoadingOptions } from '../../../model';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { FirestoreService } from '../../core/firestore.service';
import { ShowLoadingService } from '../../core/show-loading.service';
import { take, switchMap, tap, filter, } from 'rxjs/operators';
import { ShowToastService } from '../../core/show-toast.service';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})
export class HomePage implements OnInit {

  constructor(
    public auth: AuthService,
    private db: FirestoreService,
    private loadingCtrl: LoadingController,
    private toast: ShowToastService,
  ) {

  }

  tenders: Tender[];
  tenders$: Observable<Tender[]>;
  tendersCollection: AngularFirestoreCollection<Tender>;
  tendersAllCities$: Observable<Tender[]>;

  user$: Observable<User | null>;

  selectedCityString: string;
  selectedCityNumber: number;

  async ngOnInit() {

    const showLoading = await this.loadingCtrl.create(new M7LoadingOptions);
    await showLoading.present();

    this.selectedCityString = '0';
    this.selectedCityNumber = 0;

    this.tenders$ = this.db.col$('tenders', ref => ref.orderBy('createdAt', 'desc')).pipe(take(1));

    this.tenders$.subscribe(res => {

      const currentTime = new Date().getTime();
      this.tenders = res.filter(element => {
        // if current time is less than deadline keep it in ====> STILL NOT ENDED!
        return (element.deadline > currentTime);
      });

      showLoading.dismiss();
    });
  }

  /* LATER: maybe make it show the company's city on log in
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
  public async onSelectCity($event) {

    const showLoading = await this.loadingCtrl.create(new M7LoadingOptions);
    await showLoading.present();

    this.selectedCityNumber = Number(this.selectedCityString);

    if (this.selectedCityNumber === 0) {
      // NOTE: If all cities is selected.
      this.tenders$ = this.db.col$('tenders', ref => ref.orderBy('createdAt', 'desc'));
      this.tenders$.pipe(take(1)).subscribe(res => {
        const currentTime = new Date().getTime();
        this.tenders = res.filter(element => {
          // if current time is less than deadline keep it in ====> STILL NOT ENDED!
          return (element.deadline > currentTime);
        });

        showLoading.dismiss();
      });
    }
    else {
      // NOTE: If a specific city is selected:
      let temp$: Observable<Tender[]>
        = this.db.col$('tenders', ref => ref.where('city', '==', this.selectedCityNumber).orderBy('createdAt', 'desc'));

      // NOTE: If there are no tenders in that city:

      this.tenders$ = temp$.pipe(
        take(1),
        switchMap(res => {
          const currentTime = new Date().getTime();
          let res2 = res.filter(element => {
            // if current time is less than deadline keep it in ====> STILL NOT ENDED!
            return (element.deadline > currentTime);
          });

          if (res2.length === 0) {

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

            this.selectedCityString = '0';
            this.selectedCityNumber = 0;

            return this.db.col$('tenders', ref => ref.orderBy('createdAt', 'desc'));
          } else {
            // NOTE: if there's tenders in selected city:
            return this.db.col$('tenders', ref => ref.where('city', '==', this.selectedCityNumber).orderBy('createdAt', 'desc'));
          }
        })
      );

      this.tenders$.pipe(take(1)).subscribe(res => {
        const currentTime = new Date().getTime();
        this.tenders = res.filter(element => {
          // if current time is less than deadline keep it in ====> STILL NOT ENDED!
          return (element.deadline > currentTime);
        });

        showLoading.dismiss();
      });
    }

  }

}
