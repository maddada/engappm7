import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonRouterOutlet, Platform, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/auth.service';

// import * as firebase from 'firebase/app';

/* get a reference to the used IonRouterOutlet
assuming this code is placed in the component
that hosts the main router outlet, probably app.components */


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styles: [`
    ion-content {
        --background: white;
    }

    ion-item {
        --padding-start: 10px;
    }
    `],
})
export class AppComponent {

    @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

    public username: string;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private storage: Storage,
        public auth: AuthService,
        private nav: NavController,
        public translate: TranslateService
    ) {
        this.initializeApp();
    }



    initializeApp() {

        this.platform.ready().then(() => {

            this.checkFirstLaunch();
            this.getSetLanguage();
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });

    }

    checkFirstLaunch(): any {
        // this.storage.clear();

        this.storage.get('first_time').then((val) => {
            if (val !== null) {
                // console.log(`Not first launch.`);
            } else {
                // console.log('First launch.');
                // this.nav.navigateRoot('/select-language');
            }
        });
    }

    getSetLanguage(): any {
        this.storage.get('language').then((val) => {
            if (val !== null) {
                // _: if language set from before:
                // _: use that language.
                this.translate.setDefaultLang(val);
                this.translate.use(val);
            } else {
                // _: if language not set from before:
                // _: use english.
                this.translate.setDefaultLang('en');
                this.translate.use('en');
                this.storage.set('language', 'en');
            }
        });
    }

    aboutClicked() {
        if (this.translate.currentLang === 'ar') {
            this.nav.navigateForward('/wizard-ar');
        }
        if (this.translate.currentLang === 'en') {
            this.nav.navigateForward('/wizard');
        }
    }


}





    // LATER: [Super 6af] Fix Back button android
    // fix show alert thing, and enable this one so
    // this.platform.backButton.subscribe(() => {
    //   if (this.routerOutlet && this.routerOutlet.canGoBack()) {
    //     this.routerOutlet.pop();
    //   } else if (this.router.urtranslate.currentLang==='en '/LoginPage') {
    //     navigator['app'].exitApp();
    //   } else {
    //     this.generic.showAlert('Exit', 'Do you want to exit the app?', this.onYesHandler, this.onNoHandler, 'backPress');
    //   }
    // });
