import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../model';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company-list-element',
  templateUrl: './company-list-element.component.html',
  styleUrls: ['./company-list-element.component.scss']
})
export class CompanyListElementComponent implements OnInit {

  @Input() company: User;
  @Input() extended: boolean;



  constructor(private nav: NavController, public translate: TranslateService) { }

  ngOnInit() {
    // console.log(this.company.profileNameAr);
  }

  public viewProfile() {
    this.nav.navigateForward(`/view-profile/${this.company.uid}`);
  }

}
