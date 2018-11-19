import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { ShowToastService } from '../../core/show-toast.service';

import { TranslateService } from '@ngx-translate/core';
import { LoadingController, NavController } from '@ionic/angular';

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

  public isLoggedIn: string;
  public email: string;
  public password: string;

  constructor(
    private toast: ShowToastService,
    public auth: AuthService,
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public nav: NavController,
  ) {
  }

  ngOnInit() {
  }

  public async onClickLogin() {
    if (this.validate()) {

      const showLoading = await this.loadingCtrl.create({
        translucent: false,
        spinner: "bubbles",
        showBackdrop: true,
        animated: true,
        keyboardClose: true,
        mode: "md",
      });
      await showLoading.present();

      this.auth.emailLogin(this.model.email, this.model.password).then(() => {
        showLoading.dismiss();
        this.nav.navigateForward('/');
      }).catch(
        error =>
          this.toast.showToast('Please Check Inputs and Network')
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
  // private handleError(error: Error) {
  //   console.error(error);
  //   this.toast.showToast(`${error}`);
  // }


}

