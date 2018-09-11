import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  protected isLoggedIn: string;

  constructor(
    private menuCtrl: MenuController,
    private auth: AuthService,
  ) {

  }

  ngOnInit() {

  }

}
