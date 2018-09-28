import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
// import 'firebase/auth';
// import { auth } from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap, first, startWith, tap, filter, take, map, share } from 'rxjs/operators';

import { User } from '../../model';
import { ShowToastService } from './show-toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null>;
  userID: string;

  public isUserLoggedIn$: BehaviorSubject<boolean>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private toast: ShowToastService,
  ) {

    this.isUserLoggedIn$ = new BehaviorSubject<boolean>(null).pipe(share()) as BehaviorSubject<boolean>;

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {

          console.log('auth service: logged in!');
          this.isUserLoggedIn$.next(true);
          this.userID = user.uid;
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();

        } else {

          console.log('auth service: not logged in!');
          this.isUserLoggedIn$.next(false);
          this.userID = null;
          return of(null);

        }
      }),
    );

    this.user$.subscribe();

    // this.afAuth.user();

    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user) {
    //     this.isUserLoggedIn$.next(true);
    //   } else {
    //     this.isUserLoggedIn$.next(false);
    //   }
    // });
  }

  uid() {
    return this.user$
      .pipe(
        take(1),
        map(u => u && u.uid)
      )
      .toPromise();
  }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.toast.showToast('Welcome back!', '', 2000);
        this.router.navigateByUrl('/');
      })
      .catch(error => this.handleError(error));
  }

  // Sends email allowing user to reset password
  resetPassword(email: string) {
    const fbAuth = firebase.auth();

    return fbAuth
      .sendPasswordResetEmail(email)
      .then(() => this.toast.showToast('Password update email sent'))
      .catch(error => this.handleError(error));
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
  }

  // If error, console log and notify user
  private handleError(error: Error) {
    console.error(error);
    this.toast.showToast(error.message, 'error');
  }

}
