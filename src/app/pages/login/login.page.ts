import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController, LoadingController } from '@ionic/angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { ShowToastService } from '../../core/show-toast.service';
import { ShowLoadingService } from '../../core/show-loading.service';
import { M7LoadingOptions } from '../../../model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @Input() data: any;
  @Input() events: any;

  model: any = {};


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
    private toast: ShowToastService,
    public auth: AuthService,
    public nav: NavController,
    private loadingCtrl: LoadingController,
  ) {
  }

  ngOnInit() {
  }

  // keyDownFunction(event) {
  //   if (event.keyCode === 13) {
  //     console.log('you just clicked enter');
  //     this.onLoginClick();
  //     // rest of your code
  //   }
  // }

  public async onClickLogin() {
    if (this.validate()) {

      const showLoading = await this.loadingCtrl.create(new M7LoadingOptions);
      await showLoading.present();

      this.auth.emailLogin(this.model.email, this.model.password).then(() => {
        showLoading.dismiss();
        this.nav.navigateBack('/');
      }).catch(
        error =>
          this.toast.showToast('Please Check Inputs')
      );
    }
  }

  validate(): boolean {
    this.isEmailValid = true;
    this.isPasswordValid = true;

    if (!this.model.email || this.model.email.length === 0) {
      this.isEmailValid = false;
    }

    if (!this.model.password || this.model.password.length === 0) {
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

