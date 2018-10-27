import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ShowToastService } from '../core/show-toast.service';
import { NavController } from '@ionic/angular';

// NOTE: CHECKS IF LOGGED IN ALREADY!!!!

@Injectable({
  providedIn: 'root'
})
export class LoggedinGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private toast: ShowToastService,
    private nav: NavController) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const user = await this.auth.uid();
    const isLoggedIn = !!user;

    let allow: boolean;

    if (!isLoggedIn) {
      allow = true;
    } else {
      this.toast.showToast('Already logged in');
      this.nav.navigateRoot('/');
      allow = false;
    }

    return allow;

  }
}
