import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';
import { AuthService } from '../../../core/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {


  email: string;

  constructor(
    public auth: AuthService,
    public translate: TranslateService,
    public storage: Storage,

  ) { }

  resetPassword() {
    this.auth.resetPassword(this.email);
  }

  ngOnInit() {
  }

}
