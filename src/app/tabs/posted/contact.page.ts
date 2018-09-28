import { Component, OnInit, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Tender, User } from '../../../model';
import { FirestoreService } from '../../core/firestore.service';
import { AuthService } from '../../core/auth.service';
import { LoadingController } from '@ionic/angular';
import { map, delay } from 'rxjs/operators';

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.page.html',
  styleUrls: ['contact.page.scss']
})
export class ContactPage implements OnInit {

  isLoggedIn: boolean;
  user: User | null;
  tenders$: Observable<Tender[]>;

  constructor(
    private db: FirestoreService,
    private auth: AuthService,
    private loadingController: LoadingController) {

  }

  async ngOnInit() {
    // await this.delay(1000);

    this.presentLoadingWithOptions();

    this.auth.user$.pipe(
      map(u => {
        if (this.auth.userID) {
          this.tenders$ = this.db.col$('tenders', ref => ref.where('uid', '==', this.auth.userID));
          this.loadingController.dismiss();
        } else {
          this.tenders$ = null;
          this.loadingController.dismiss();
        }
      }),
      delay(1000),
      map(d => this.loadingController.dismiss())
    ).subscribe();

  }


  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      // duration: 700,
      translucent: true,
      spinner: 'bubbles',
      showBackdrop: true,
      animated: true,
      mode: 'md',
      keyboardClose: true,
      // message: '',
      // cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }



  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


}
