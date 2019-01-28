import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../core/auth.service';
import { NavController } from '@ionic/angular';
import { ShowToastService } from '../core/show-toast.service';

// NOTE: CHECKS IF NOT LOGGED IN!!!!

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private toast: ShowToastService,
    private nav: NavController
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const user = await this.auth.uid();
    const isLoggedIn = !!user;

    if (!isLoggedIn) {
      this.toast.showToast('Not Logged In');
      // for testing: comment below:
      this.nav.navigateRoot('/');
    }

    return isLoggedIn;
    // for testing: return true;

  }

}
