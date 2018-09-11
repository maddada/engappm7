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
import { switchMap, first, startWith, tap, filter, take, map } from 'rxjs/operators';

import { User } from '../../model';
import { ShowToastService } from './show-toast.service';

@Injectable()
export class AuthService {
  user: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private toast: ShowToastService,
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
      // tap(user => localStorage.setItem('user', JSON.stringify(user))),
      // startWith(JSON.parse(localStorage.getItem('user')))
    );
  }

  ////// OAuth Methods /////

  // googleLogin() {
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  // githubLogin() {
  //   const provider = new firebase.auth.GithubAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  // facebookLogin() {
  //   const provider = new auth.FacebookAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  // twitterLogin() {
  //   const provider = new auth.TwitterAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  // private oAuthLogin(provider: any) {
  //   return this.afAuth.auth
  //     .signInWithPopup(provider)
  //     .then(credential => {
  //       this.toast.showToast('Welcome to Firestarter!!!');
  //       return this.updateUserData(credential.user);
  //     })
  //     .catch(error => this.handleError(error));
  // }

  //// Anonymous Auth ////

  // anonymousLogin() {
  //   return this.afAuth.auth
  //     .signInAnonymously()
  //     .then(credential => {
  //       this.toast.showToast('Welcome to Firestarter!!!');
  //       return this.updateUserData(credential.user); // if using firestore
  //     })
  //     .catch(error => {
  //       this.handleError(error);
  //     });
  // }

  emailLogin(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(credential => {
        this.toast.showToast('Welcome back!');
        // this.user = credential.user;
        // return this.updateUserData(credential.user);
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

  // Sets user data to firestore after succesful login
  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${user.uid}`
    );

    const data: User = {
      uid: user.uid,
      email: user.email || null,
      companyName: user.companyName || ' ',
      personName: user.personName || ' ',
      // TODO: upload a new no user pic image.
      profilePicURL: user.profilePicURL || 'https://goo.gl/Fz9nrQ'
    };
    return userRef.set(data);
  }


  public isLoggedIn() {
    return this.afAuth.authState.pipe(first()).toPromise();
  }



  // public isLoggedIn(): boolean {

  //   let isLoggedIn: boolean;

  //   this.user.pipe(
  //     take(1),
  //     map(user => !!user), // make into boolean value
  //     tap(loggedIn => {
  //       isLoggedIn = loggedIn;

  //       if (!loggedIn) {
  //         isLoggedIn = loggedIn;

  //         console.log('access denied');
  //         this.toast.showToast('You must be logged in!', 'error');
  //         this.router.navigate(['/login']);
  //       }
  //     }));

  //   return isLoggedIn;

  // }

}
