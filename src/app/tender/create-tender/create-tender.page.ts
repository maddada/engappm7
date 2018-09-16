import { Component, OnInit } from '@angular/core';
import { Tender } from '../../../model';

@Component({
  selector: 'app-create-tender',
  templateUrl: './create-tender.page.html',
  styleUrls: ['./create-tender.page.scss'],
})
export class CreateTenderPage implements OnInit {

  testTender: Tender;
  testTenders: Tender[];

  constructor() {
    this.testTender = {
      deadline: Date,
      createdBy: 'userid1',
      creatorEmail: 'test@test.com',
      nameOfCompany: 'Company Name',
      nameOfPerson: 'string',
      numberOfProposals: 0,
      participationFee: 1000,
      bidBondPercent: 5,
      sector: 1,
      city: 2,
      attachmentURLs: ['link1', 'link2'],
    };

    this.testTenders = [this.testTender, this.testTender, this.testTender];

  }

  ngOnInit() {

  }

}
