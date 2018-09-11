import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ShowToastService } from './show-toast.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedinGuard implements CanActivate {

  loggedIn: boolean;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: ShowToastService
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.checkIfLoggedIn();

    if (this.loggedIn) {
      console.log('Auth Guard: Access Denied: Already logged in');
      this.toast.showToast(`Already Logged In!`, '', 1000);

      return false;
    }
    else {
      console.log('Auth Guard: Access Allowed: Not logged in');
      return true;
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

  // Observable<boolean> | Promise<boolean> | boolean {
  // return this.auth.user.pipe(
  //   take(1),
  //   map(user => !!user),
  //   tap(loggedIn => {
  //     if (loggedIn) {
  //       console.log('access denied: Already logged in');
  //       this.toast.showToast(`Already Logged In!`);
  //       awaut
  //       this.router.navigateByUrl('/');
  //     }
  //   })
  // );

  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   return true;
  // }


