import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../core/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tender } from '../../model';
import { AngularFirestoreCollection } from '@angular/fire/firestore';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  protected isLoggedIn: string;

  tenders$: Observable<Tender[]>;

  tendersCollection: AngularFirestoreCollection<Tender>;

  constructor(
    private menuCtrl: MenuController,
    private auth: AuthService,
  ) {

  }

  ngOnInit() {
    this.tenders$ = this.getTendersSnapshot();
  }


  getTendersSnapshot(): Observable<Tender[]> {
    return this.tendersCollection.valueChanges().pipe(map((actions) => {
      return actions.map((a) => {
        const data = a as Tender;
        return data;
      });
    }).share();

  }
}
