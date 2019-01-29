import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../core/firestore.service';
import { Tender, User } from '../../../model';
import { Observable, of, Subject } from 'rxjs';
import { take, switchMap, takeUntil } from 'rxjs/operators';
import { NavController, LoadingController, ModalController, AlertController } from '@ionic/angular';
import { PreviousRouteService } from '../../core/previous-route.service';
import { JoinTenderModalPage } from '../join-tender-modal/join-tender-modal.page';
import { AuthService } from '../../core/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ShowToastService } from '../../core/show-toast.service';

@Component({
  selector: 'app-view-tender',
  templateUrl: './view-tender.page.html',
  styleUrls: ['./view-tender.page.scss'],
})
export class ViewTenderPage implements OnInit, OnDestroy {

  id: string;

  tender$: Observable<Tender>;
  company$: Observable<User>;
  notFoundString: string = "";

  tender: Tender;
  company: User;
  user: User;
  showNotFound: boolean = false;

  unsubscribe$: Subject<any> = new Subject();

  savedTenderUid: string;

  constructor(
    private route: ActivatedRoute,
    private db: FirestoreService,
    private nav: NavController,
    private loadingCtrl: LoadingController,
    private prevRoute: PreviousRouteService,
    private modal: ModalController,
    private auth: AuthService,
    public translate: TranslateService,
    public toast: ShowToastService,
    private alertCtrl: AlertController,
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

    this.tender$ = this.db.doc$<Tender>(`tenders/${this.id}`);

    this.company$ = this.tender$.pipe(
      switchMap(tender => {
        // subs to tender$ and gets values from it, uses data to create another obs
        if (tender) { // if tender exists
          // then it returns the new observable
          this.savedTenderUid = tender.uid;
          return this.db.doc$<User>(`users/${tender.uid}`);
        } else {
          // return null so nothing appears
          return of(null); //return obs containing null only
        }
      })
    );

    this.auth.user$.subscribe(res => this.user = res);

    this.tender$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.tender = res;
    });

    this.company$.pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      this.company = res;
      this.showNotFound = true;
      showLoading.dismiss();
    });
  }

  // if coming from create-tender page, then go to root
  // if coming from anywhere else then just go back
  // tested and working perfectly
  goBack() {
    try { //not sure if this is causing problems on iOS
      let prevRouterString = this.prevRoute.getPreviousUrl();
      if (prevRouterString.includes('/create-tender')) {
        this.nav.navigateBack('/tabs/tab2');
      }
    }
    catch (err) {
      console.log(err);
    }

    if (this.savedTenderUid === this.user.uid) { //cuz tender will be undefined when it's deleted.
      this.nav.navigateBack('/tabs/tab2');
    }

    if (this.tender == null) { //incase tender was deleted.
      this.nav.navigateBack('/tabs/tab2');
    }

    this.nav.back();
  }

  async joinTender() {
    const modal = await this.modal.create({
      component: JoinTenderModalPage,
      componentProps: { tender: this.tender }
    });
    return await modal.present();
  }

  async deleteTender() {

    let message;
    let confirmText;
    let cancelText;
    let toastMessage;

    if (this.translate.currentLang === 'ar') {
      message = 'يرجى تأكيد مسح المناقصة';
      confirmText = 'تأكيد';
      cancelText = 'إلغاء';
      toastMessage = 'تم مسح المناقصة';
    } else {
      message = 'Confirm Deletion';
      confirmText = 'Confirm';
      cancelText = 'Cancel';
      toastMessage = 'Tender Deleted!';
    }

    const alert = await this.alertCtrl.create({
      // header: 'Confirm!',
      message: message,
      buttons: [
        {
          text: cancelText,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: confirmText,
          handler: () => {
            this.db.delete(`tenders/${this.id}`).then(_ => {
              this.toast.showToast(toastMessage);
              this.nav.navigateBack('/');
            });
          }
        }
      ]
    });

    await alert.present();

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
