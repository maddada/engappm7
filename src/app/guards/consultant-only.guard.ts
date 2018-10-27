import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../core/auth.service';
import { AlertController, NavController } from '@ionic/angular';
import { ShowToastService } from '../core/show-toast.service';
import { User } from '../../model';

// NOTE: CHECKS IF ACCOUNT IS LOGGED IN AND CONSULTANT!!!!

@Injectable({
  providedIn: 'root'
})
export class ConsultantOnlyGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private toast: ShowToastService,
    private nav: NavController
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const user: User = await this.auth.uid();

    let allow: boolean;

    if (user != null && user.accountType === 2) {
      allow = true;
    } else {
      allow = false;
      this.toast.showToast('Not a Consultant');
      this.nav.navigateRoot('/');
    }

    return allow;
  }

}
