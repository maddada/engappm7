import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../model';

@Component({
  selector: 'app-company-list-element',
  templateUrl: './company-list-element.component.html',
  styleUrls: ['./company-list-element.component.scss']
})
export class CompanyListElementComponent implements OnInit {

  @Input() company: User;

  constructor() { }

  ngOnInit() {
  }

}
