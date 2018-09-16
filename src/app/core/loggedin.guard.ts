import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ShowToastService } from './show-toast.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedinGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private toast: ShowToastService) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const uid = await this.auth.uid();
    const isLoggedIn = !!uid;

    let allow: boolean;

    if (isLoggedIn) {

      this.toast.showToast('Already logged in');
      allow = false;

    } else {
      allow = true;
    }

    return allow;
  }
}
