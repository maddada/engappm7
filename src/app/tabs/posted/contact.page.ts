import { Component, OnInit } from '@angular/core';
import { Tender } from '../../../model';

@Component({
  selector: 'app-contact',
  templateUrl: 'contact.page.html',
  styleUrls: ['contact.page.scss']
})
export class ContactPage implements OnInit {

  tenders: Tender[] = [
    {
      companyName: 'Morgenall Group',
      tenderCategory: 'tender_general',
      tenderTitle: 'Car Tents Installation Al Khan',
      city: 2,
      TESTSTATUS: 'Recent',
      TESTPUBLISHED: '10-10-2018',
      TESTDEADLINE: '02-01-2019',
    },

    {
      companyName: 'AlThuraya Consaltancy',
      tenderCategory: 'tender_construction',
      tenderTitle: 'Construction of School in Qusais',
      city: 2,
      TESTSTATUS: 'Recent',
      TESTPUBLISHED: '10-09-2018',
      TESTDEADLINE: '20-10-2018',
    },
    {
      companyName: 'AlThuraya Consaltancy',
      tenderCategory: 'tender_steel',
      tenderTitle: 'Construction of Mosque',
      city: 3,
      TESTSTATUS: 'Recent',
      TESTPUBLISHED: '04-08-2018',
      TESTDEADLINE: '25-10-2018',
    },
    {
      companyName: 'Al Thuraya Consaltancy',
      tenderCategory: 'tender_maintenance',
      tenderTitle: 'Maintenance of Offices ',
      city: 4,
      TESTSTATUS: 'Recent',
      TESTPUBLISHED: '01-07-2018',
      TESTDEADLINE: '14-11-2018',
    },
    {
      companyName: 'Al Thuraya Consaltancy',
      tenderCategory: 'tender_concrete',
      tenderTitle: 'Concrete Construction Shahama',
      city: 2,
      TESTSTATUS: 'Recent',
      TESTPUBLISHED: '10-09-2018',
      TESTDEADLINE: '25-11-2018',
    },
  ];


  ngOnInit() {

  }

}
