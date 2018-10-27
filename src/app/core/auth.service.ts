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

import { Observable, of } from 'rxjs';
import { switchMap, take, map, } from 'rxjs/operators';

import { User } from '../../model';
import { ShowToastService } from './show-toast.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User | null>;
  user: User | null;
  userID: string;
  userPromise: Promise<User>;

  // public isUserLoggedIn$: BehaviorSubject<boolean>;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private toast: ShowToastService,
    private db: FirestoreService
  ) {


    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {

          // console.log('auth service: logged in!');
          this.userID = user.uid;
          // this.user = user;

          this.userPromise = new Promise((resolve) => {
            resolve(this.user);
          });

          return this.db.doc$<User>(`users/${user.uid}`);
          //Same as:
          //return this.afs.doc<User>(`users/${user.uid}`).valueChanges();

        } else {

          // console.log('auth service: not logged in!');
          // this.isUserLoggedIn$.next(false);
          this.userID = null;
          this.user = null;
          return of(null);

        }
      }),
    );

    //subscribing here cuz can't add .subscribe above;
    this.user$.subscribe(res =>
      this.user = res
    );

  }

  uid(): Promise<User> {
    return this.user$.pipe(take(1)).toPromise();
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
      .then(() => {
        this.toast.showToast('Password Reset Email Sent!');
      })
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
