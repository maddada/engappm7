import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../core/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, Tender } from '../../model';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { FirestoreService } from '../core/firestore.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  protected isLoggedIn: string;

  tenders$: Observable<Tender[]>;
  tendersCollection: AngularFirestoreCollection<Tender>;

  currentUser: User;

  constructor(
    private menuCtrl: MenuController,
    private auth: AuthService,
    private db: FirestoreService,
  ) {

  }

  ngOnInit() {
    this.auth.user$.subscribe(user => {
      this.currentUser = user;
      this.tenders$ = this.db.col$('tenders', ref => ref.where('city', '==', this.currentUser.city));
    });
  }


}
