import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-select-acc-type',
  templateUrl: './select-acc-type.page.html',
  styleUrls: ['./select-acc-type.page.scss'],
})
export class SelectAccTypePage implements OnInit {

  constructor(private nav: NavController) { }

  ngOnInit() {
  }

  goBack() {
    this.nav.back();
  }
}
