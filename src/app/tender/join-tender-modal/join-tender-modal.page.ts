import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Tender } from '../../../model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-join-tender-modal',
  templateUrl: './join-tender-modal.page.html',
  styleUrls: ['./join-tender-modal.page.scss'],
})
export class JoinTenderModalPage implements OnInit {

  originalWhatsapp: string;
  fixedWhatsapp: string;
  tempTender: Tender;

  constructor(
    private modal: ModalController,
    private navParams: NavParams,
    public translate: TranslateService,
  ) { }

  ngOnInit() {

    this.tempTender = this.navParams.data.tender;
    this.fixWhatsappNumber();
  }

  // NOTE: This function is needed so the whatsapp on click wa.me/ link will work!
  fixWhatsappNumber() {

    // _: required format is 971501234567
    if (this.tempTender.tenderContactWhatsapp != null) {

      this.originalWhatsapp = this.tempTender.tenderContactWhatsapp;
      this.originalWhatsapp = this.originalWhatsapp.replace(' ', '');

      if (this.originalWhatsapp.startsWith('+')) { // +971...
        this.originalWhatsapp = this.originalWhatsapp.slice(1);
      }
      else if (this.originalWhatsapp.startsWith('00')) { // 00971...
        this.originalWhatsapp = this.originalWhatsapp.slice(2);
      }
      else if (this.originalWhatsapp.startsWith('05')) { //050 052 054 055 056 etc.
        this.originalWhatsapp = this.originalWhatsapp.slice(1);
        this.originalWhatsapp = '971' + this.originalWhatsapp;
        // console.log(this.originalWhatsapp);
      }

      if (this.originalWhatsapp.length === 12 && this.originalWhatsapp.startsWith('97')) {
        this.fixedWhatsapp = this.originalWhatsapp;
      } else {
        this.fixedWhatsapp = null;
      }
    }
  }

  openWhatsapp() {
    window.open(`https://wa.me/${this.fixedWhatsapp}`, '_blank');
  }

  openPhone() {
    window.open(`tel:${this.tempTender.tenderContactNumber}`, '_top');
  }

  sendEmail() {
    let tempSubject = this.tempTender.tenderTitle.replace(' ', '%20');

    window.open(`mailto:${this.tempTender.tenderContactEmail}?Subject=${tempSubject}`, '_top');
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modal.dismiss();
  }
}
