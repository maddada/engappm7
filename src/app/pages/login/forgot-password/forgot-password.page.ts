import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  public user: User;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

}
