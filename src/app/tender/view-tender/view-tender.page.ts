import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../core/firestore.service';
import { Tender, User, M7LoadingOptions } from '../../../model';
import { Observable, of } from 'rxjs';
import { finalize, take, flatMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { NavController, LoadingController, ModalController } from '@ionic/angular';
import { ShowLoadingService } from '../../core/show-loading.service';
import { PreviousRouteService } from '../../core/previous-route.service';
import { JoinTenderModalPage } from '../join-tender-modal/join-tender-modal.page';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-view-tender',
  templateUrl: './view-tender.page.html',
  styleUrls: ['./view-tender.page.scss'],
})
export class ViewTenderPage implements OnInit {

  tender$: Observable<Tender>;
  company$: Observable<User>;
  notFoundString: string = "";

  tender: Tender;
  company: User;
  user: User;
  showNotFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private db: FirestoreService,
    private nav: NavController,
    private loadingCtrl: LoadingController,
    private prevRoute: PreviousRouteService,
    private modal: ModalController,
    private auth: AuthService,
  ) { }

  async ngOnInit() {


    const showLoading = await this.loadingCtrl.create(new M7LoadingOptions);
    await showLoading.present();


    const id = this.route.snapshot.paramMap.get('id');
    console.log(id);

    // this.db.inspectDoc(`tenders/${id}`);

    this.tender$ = this.db.doc$<Tender>(`tenders/${id}`)
      .pipe(take(1));

    this.company$ = this.tender$.pipe(
      take(1),
      switchMap(tender => {
        // subs to tender$ and gets values from it, uses data to create another obs
        if (tender) { // if tender exists
          // then it returns the new observable
          return this.db.doc$<User>(`users/${tender.uid}`);
        } else {
          // return null so nothing appears
          return of(null); //return obs containing null only
        }
      })
    );

    this.auth.user$.subscribe(res => this.user = res);

    this.tender$.pipe(take(1)).subscribe(res => {
      this.tender = res;
    });

    this.company$.pipe(take(1)).subscribe(res => {
      this.company = res;
      this.showNotFound = true;
      showLoading.dismiss();
    });
  }

  //tested and working perfectly
  goBack() {
    let prevRouterString = this.prevRoute.getPreviousUrl();
    // console.log(prevRouterString);
    if (prevRouterString.includes('/create-tender')) {
      this.nav.navigateBack('/');
    }
    else {
      this.nav.goBack();
    }
  }

  async joinTender() {
    const modal = await this.modal.create({
      component: JoinTenderModalPage,
      componentProps: { tender: this.tender }
    });
    return await modal.present();
  }


}
