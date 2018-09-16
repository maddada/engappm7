import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../core/auth.service';
import { AlertController } from '@ionic/angular';
import { ShowToastService } from './show-toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private toast: ShowToastService
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const uid = await this.auth.uid();
    const isLoggedIn = !!uid;

    if (!isLoggedIn) {
      this.toast.showToast('Already logged in');

      //   const alert = await this.alertController.create({
      //     header: 'Blocked',
      //     subHeader: 'Users only',
      //     message: 'You have been blocked by the router guard...',
      //     buttons: ['OK']
    }

    return isLoggedIn;
    // await alert.present();
  }

}
