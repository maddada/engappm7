import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { AuthService } from '../core/auth.service';
import { ShowToastService } from '../core/show-toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @Input() data: any;
  @Input() events: any;


  private isEmailValid: boolean = true;
  private isPasswordValid: boolean = true;

  private background = '';
  private forgotPassword = 'Forgot password?';
  private subtitle: string = 'Welcome';
  private labelEmail: string = 'EMAIL';
  private labelPassword: string = 'PASSWORD';
  private title: string = 'Login to your account';
  private emailPlaceholder: string = 'Enter your email';
  private passwordPlaceholder: string = 'Enter your password';
  private register: string = 'Register';
  private login: string = 'Login';
  private skip: string = 'Skip';
  private logo: string = 'assets/images/logo/1.png';
  private errorUser: string = 'Field can\'t be empty';
  private errorPassword: string = 'Field can\'t be empty';
  protected isLoggedIn: string;
  private email: string;
  private password: string;

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private auth: AuthService,
    private toast: ShowToastService,
  ) { }

  ngOnInit() {
  }

  protected onLoginClick(): void {
    if (this.validate()) {
      this.auth.emailLogin(this.email, this.password).catch(
        error =>
          this.toast.showToast('Please Check Inputs')
      );
    }
  }

  validate(): boolean {
    this.isEmailValid = true;
    this.isPasswordValid = true;

    if (!this.email || this.email.length === 0) {
      this.isEmailValid = false;
    }

    if (!this.password || this.password.length === 0) {
      this.isPasswordValid = false;
    }

    return this.isPasswordValid && this.isEmailValid;
  }



  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    this.toast.showToast(`${error}`);
  }




}

