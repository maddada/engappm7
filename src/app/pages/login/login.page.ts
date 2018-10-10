import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

import { AuthService } from '../../core/auth.service';
import { ShowToastService } from '../../core/show-toast.service';

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

  public background = '';
  public forgotPassword = 'Forgot password?';
  public subtitle: string = 'Welcome';
  public labelEmail: string = 'EMAIL';
  public labelPassword: string = 'PASSWORD';
  public title: string = 'Login to your account';
  public emailPlaceholder: string = 'Enter your email';
  public passwordPlaceholder: string = 'Enter your password';
  public register: string = 'Register';
  public login: string = 'Login';
  public skip: string = 'Skip';
  public logo: string = 'assets/images/logo/logo.png';
  public errorUser: string = 'Field can\'t be empty';
  public errorPassword: string = 'Field can\'t be empty';
  public isLoggedIn: string;
  public email: string;
  public password: string;

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private toast: ShowToastService,
    public auth: AuthService,
  ) { }

  ngOnInit() {
  }

  public onLoginClick(): void {
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

