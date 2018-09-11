import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  loggedIn: boolean;

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.checkIfLoggedIn();
  }

  async checkIfLoggedIn() {
    const user = await this.auth.isLoggedIn();
    if (user) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
      // this.isLoggedIn = 'NOT LOGGED IN';
    }
  }

}
