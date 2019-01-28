import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFireFunctions } from '@angular/fire/functions';
import { ToastController, Platform } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { from } from 'rxjs';
import { Firebase } from '@ionic-native/firebase/ngx';

// Fixing temporary bug in AngularFire
import * as app from 'firebase';
import { ShowToastService } from './show-toast.service';
import { unsubscribeFromTopic } from '../../../functions/src';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  token: any;
  enabled: boolean = false;

  constructor(
    private afMessaging: AngularFireMessaging,
    private fun: AngularFireFunctions,
    private firebaseNative: Firebase,
    private platform: Platform,
    private toast: ShowToastService,
  ) {
    try {
      const _messaging = app.messaging();
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    } catch (e) { }
  }

  async makeToast(message) {
    this.toast.toastController.dismiss().catch(_ => { });

    this.toast.showToast(message);
    // const toast = await this.toastController.create({
    //   message,
    //   duration: 3000,
    //   position: 'bottom',
    //   showCloseButton: true,
    //   closeButtonText: 'dismiss',
    //   cssClass: 'm7toast'
    // });
    // toast.present();
  }

  getPermission() {
    let token$;
    if (this.platform.is('cordova')) {
      token$ = from(this.getPermissionNative());
    } else {
      token$ = this.getPermissionWeb();
    }
    return token$.pipe(
      tap(token => {
        this.token = token;
      })
    );
  }

  private getPermissionWeb() {
    return this.afMessaging.requestToken;
  }

  private async getPermissionNative() {
    let token;

    if (this.platform.is('ios')) {
      await this.firebaseNative.grantPermission();
    }

    token = await this.firebaseNative.getToken();

    return token;
  }

  listenToMessages() {
    let messages$;
    if (this.platform.is('cordova')) {
      messages$ = this.firebaseNative.onNotificationOpen();
    } else {
      messages$ = this.afMessaging.messages;
    }

    return messages$.pipe(tap(v => this.showMessages(v)));
  }

  showMessages(payload) {
    let body;

    console.log('showMessage called');

    if (this.platform.is('android')) {
      body = payload.body;
    } else {
      body = payload.notification.body;
    }

    this.makeToast(body);
  }

  sub(topic) {
    if (this.token == null) {
      console.log('token is null 1');
      this.getPermission();
    } else {
      this.fun
        .httpsCallable('subscribeToTopic')({ topic, token: this.token })
        .pipe(tap(_ =>
          this.makeToast(`Notifications Enabled`)
          // this.makeToast(`Subscribed to ${topic}`
        ))
        .subscribe();
    }
  }

  unsub(topic) {
    if (this.token == null) {
      console.log('token is null 2');
      this.getPermission().subscribe();
    } else {
      this.fun
        .httpsCallable('unsubscribeFromTopic')({ topic, token: this.token })
        .pipe(tap(_ =>
          this.makeToast(`Notifications Disabled`)
          // this.makeToast(`Unsubscribed from ${topic}`)
        ))
        .subscribe();
    }
  }
}

// import { Injectable } from '@angular/core';
// import { Firebase } from '@ionic-native/firebase';
// import { AngularFirestore } from '@angular/fire/firestore';
// import { Platform } from '@ionic/angular';
// import { AuthService } from '../core/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class FcmService {
//   constructor(
//     public firebaseNative: Firebase,
//     public afs: AngularFirestore,
//     private platform: Platform,
//     private auth: AuthService,
//   ) { }

//   async getToken() {

//     let token;

//     if (this.platform.is('android')) {

//       token = await this.firebaseNative.getToken()
//     }

//     if (this.platform.is('ios')) {
//       token = await this.firebaseNative.getToken();
//       const perm = await this.firebaseNative.grantPermission();
//     }

//     // Is not cordova == web PWA
//     if (!this.platform.is('cordova')) {
//       // TODO add PWA support with angularfire2
//     }

//     return this.saveTokenToFirestore(token)
//   }

//   private async saveTokenToFirestore(token) {
//     if (!token) return;
//     const devicesRef = this.afs.collection('devices')

//     const user = await this.auth.uid();

//     const docData = {
//       token,
//       userId: user.uid,
//     }

//     return devicesRef.doc(token).set(docData)
//   }

//   listenToNotifications() {
//     return this.firebaseNative.onNotificationOpen()
//   }
// }
