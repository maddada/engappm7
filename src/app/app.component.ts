import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

import { AuthService } from './core/auth.service';


/* get a reference to the used IonRouterOutlet
assuming this code is placed in the component
that hosts the main router outlet, probably app.components */


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private storage: Storage,
    private auth: AuthService,
  ) {
    this.initializeApp();

  }

  /* if this is inside a page that was loaded into the router outlet,
  like the start screen of your app, you can get a reference to the
  router outlet like this:
  @Optional() private routerOutlet: IonRouterOutlet, */



  initializeApp() {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.checkFirstLaunch();
      this.checkIfLoggedIn();
    });





    // TODO: [Super 6af] Fix Back button android
    // fix show alert thing, and enable this one so
    // this.platform.backButton.subscribe(() => {
    //   if (this.routerOutlet && this.routerOutlet.canGoBack()) {
    //     this.routerOutlet.pop();
    //   } else if (this.router.url === '/LoginPage') {
    //     navigator['app'].exitApp();
    //   } else {
    //     this.generic.showAlert('Exit', 'Do you want to exit the app?', this.onYesHandler, this.onNoHandler, 'backPress');
    //   }
    // });


  }

  async checkIfLoggedIn() {
    const user = await this.auth.isLoggedIn();
    if (user) {
      this.appPages.push({
        title: 'Log Out',
        url: '/logout',
        icon: 'exit'
      });
    } else {
      console.log('app.component.ts: not logged in');
      // this.isLoggedIn = 'NOT LOGGED IN';
    }
  }

  // TODO: Make wizard show up if first launch!
  checkFirstLaunch(): any {
    // this.storage.clear(); // for testing

    this.storage.get('first_time').then((val) => {
      if (val !== null) {
        console.log(`Not first launch.`);
      } else {
        console.log('First launch.');
        this.storage.set('first_time', 'done');
      }
    });
  }

}


