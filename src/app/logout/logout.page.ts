import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
  }

  signOutClicked() {
    this.auth.signOut();
  }
}
