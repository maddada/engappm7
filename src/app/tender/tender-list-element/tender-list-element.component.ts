import { Component, OnInit, Input } from '@angular/core';
import { Tender } from '../../../model';

@Component({
  selector: 'app-tender-list-element',
  templateUrl: './tender-list-element.component.html',
  styleUrls: ['./tender-list-element.component.scss']
})
export class TenderListElementComponent implements OnInit {

  @Input() tender: Tender;

  constructor() {
  }


  ngOnInit() {
  }

}
