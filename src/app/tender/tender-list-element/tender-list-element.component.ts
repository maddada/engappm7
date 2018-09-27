import { Component, OnInit, Input } from '@angular/core';
import { Tender } from '../../../model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tender-list-element',
  templateUrl: './tender-list-element.component.html',
  styleUrls: ['./tender-list-element.component.scss']
})
export class TenderListElementComponent implements OnInit {

  @Input() tender: Tender;
  @Input() extended: boolean;

  constructor(private nav: NavController) {
  }


  ngOnInit() {
  }

  view_tender(tenderId) {
    this.nav.navigateForward(`/view-tender/${this.tender.tenderId}`);
  }

}
