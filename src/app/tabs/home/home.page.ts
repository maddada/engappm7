import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../../core/auth.service';
import { Observable, pipe } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { User, Tender } from '../../../model';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { FirestoreService } from '../../core/firestore.service';
import { log } from 'util';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  tenders$: Observable<Tender[]>;
  tendersCollection: AngularFirestoreCollection<Tender>;

  tenders: Tender[] = [
    {
      companyName: 'Tiger Consulting',
      tenderCategory: 'tender_prefab',
      tenderTitle: 'Prefab Offices Installation',
      city: 1,
      TESTSTATUS: 'Ending Soon',
      TESTPUBLISHED: '19-09-2018',
      TESTDEADLINE: '22-10-2018',
    },
    {
      companyName: 'Al Samer Consulting',
      tenderCategory: 'tender_maintenance',
      tenderTitle: 'Maintenance of Offices ',
      city: 4,
      TESTSTATUS: 'Recent',
      TESTPUBLISHED: '01-07-2018',
      TESTDEADLINE: '14-11-2018',
    },
    {
      companyName: 'Sharqiya Consultants',
      tenderCategory: 'tender_concrete',
      tenderTitle: 'Concrete Construction Shahama',
      city: 2,
      TESTSTATUS: 'Recent',
      TESTPUBLISHED: '10-09-2018',
      TESTDEADLINE: '25-11-2018',
    },
    {
      companyName: 'Carting Consulting',
      tenderCategory: 'tender_insulation',
      tenderTitle: 'Building Insulation',
      city: 1,
      TESTSTATUS: 'Recent',
      TESTPUBLISHED: '17-09-2018',
      TESTDEADLINE: '20-10-2018',
    }, {
      companyName: 'Wathba Consulting',
      tenderCategory: 'tender_steel',
      tenderTitle: 'Construction of Mosque',
      city: 3,
      TESTSTATUS: 'Recent',
      TESTPUBLISHED: '04-08-2018',
      TESTDEADLINE: '25-10-2018',
    },
    {
      companyName: 'AON Management Consulting',
      tenderCategory: 'tender_fencing',
      tenderTitle: 'Fence for Villas',
      city: 8,
      TESTSTATUS: 'Recent',
      TESTPUBLISHED: '10-10-2018',
      TESTDEADLINE: '27-11-2018',
    },
    {
      companyName: 'Al Samer Consulting',
      tenderCategory: 'tender_maintenance',
      tenderTitle: 'Maintenance of Old Mosque',
      city: 6,
      TESTSTATUS: 'Recent',
      TESTPUBLISHED: '16-08-2018',
      TESTDEADLINE: '28-11-2018',
    },
    {
      companyName: 'Emirates Consulting',
      tenderCategory: 'tender_construction',
      tenderTitle: 'Construction of School in Qusais',
      city: 2,
      TESTSTATUS: 'Recent',
      TESTPUBLISHED: '10-09-2018',
      TESTDEADLINE: '20-10-2018',
    },
    {
      companyName: 'Morgenall Group',
      tenderCategory: 'tender_general',
      tenderTitle: 'Car Tents Installation Al Khan',
      city: 2,
      TESTSTATUS: 'Recent',
      TESTPUBLISHED: '10-10-2018',
      TESTDEADLINE: '02-01-2019',
    },
  ];

  user$: Observable<User | null>;
  selectedCityString: string;
  selectedCityNumber: number;

  constructor(
    private menuCtrl: MenuController,
    private auth: AuthService,
    private db: FirestoreService,
  ) {

  }

  ngOnInit() {
    this.auth.user$.pipe(share()).subscribe(user => {
      if (user != null) {
        this.selectedCityString = `${user.city}`;
      } else {
        this.selectedCityString = null;
      }
    });
  }

  protected onSelectCity($event): any {
    this.selectedCityNumber = Number(this.selectedCityString);
  }

}
