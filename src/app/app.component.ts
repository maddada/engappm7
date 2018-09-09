import { Component, ViewChild } from '@angular/core';

import { Platform, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';


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
    private storage: Storage
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
    });

    // ADD CHECK IF APP WAS LAUNCHED BEFORE (BY CHECKING STORAGE)

    //checks if item exists, if it doesn't (null) then calls function to set it!
    this.storage.get('appLaunchedPreviously').then(
      (val) => {
        console.log('#app.component.ts: First Launch:', val);
        if (val == null) {
          this.setFirstLaunch();
        }
      },
      error => console.error(error)
    );

    // TODO:  Back button android
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


  private setFirstLaunch(): void {
    this.storage.set('appLaunchedPreviously', 'true');
  }


}
