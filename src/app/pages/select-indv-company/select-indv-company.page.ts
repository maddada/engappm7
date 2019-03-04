import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-indv-company',
  templateUrl: './select-indv-company.page.html',
  styleUrls: ['./select-indv-company.page.scss'],
})
export class SelectIndvCompanyPage implements OnInit {


  constructor(private nav: NavController, public translate: TranslateService) { }

  ngOnInit() {

  }

  goBack() {
    this.nav.back();
  }
}
