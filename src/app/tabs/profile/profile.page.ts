import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  private logo: string = 'assets/images/logo/Thuraya.png';

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }

}
