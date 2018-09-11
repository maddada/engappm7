import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { ShowToastService } from './show-toast.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private loggedIn: boolean;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ShowToastService,
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.checkIfLoggedIn();

    if (this.loggedIn) {
      console.log('Authguard: Access Allowed - Logged In');
      return this.loggedIn;
    }
    else {
      console.log('Authguard: Access Denied: Not logged in');
      this.toast.showToast(`Sorry, you aren't logged in!`, '', 1000);
      return this.loggedIn;
    }
  }

  async checkIfLoggedIn() {
    const user = await this.auth.isLoggedIn();

    if (user) {
      this.loggedIn = true;
    } else {
      this.loggedIn = false;
    }
  }
}

    // return this.auth.user.pipe(
    //   take(1),
    //   map(user => !!user),
    //   tap(loggedIn => {
    //     if (loggedIn) {
    //       console.log('Access Denied: Not logged in');
    //       this.toast.showToast(`Not Logged In!`);
    //       this.router.navigate(['/login']);
    //     }
    //   })
    // );



