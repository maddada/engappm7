import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit {

  constructor(private menuCtrl: MenuController, public auth: AuthService) {
  }

  ngOnInit() {
    this.menuCtrl.swipeEnable(true);
  }
}
