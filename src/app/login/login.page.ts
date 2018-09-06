import { Component, OnInit, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

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

  private email: string;
  private password: string;

  constructor(private menuCtrl: MenuController, private router: Router) { }

  ngOnInit() {
    // this.menuCtrl.swipeEnable(false);
  }

  // onEvent = (event: string): void => {
  //   if (event === 'onLogin' && !this.validate()) {
  //     return;
  //   }
  //   if (this.events[event]) {
  //     this.events[event]({
  //       'username': this.username,
  //       'password': this.password
  //     });
  //   }
  // }

  onClickLoginClick(): void {

  }

  onGoogleClick(): void {

  }

  onRegisterClick(): void {

  }

  onForgotPassClick(): void {

  }

  // onBackClick(): void {
  //   this.router.navigateByUrl('/home');
  // }

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
}
