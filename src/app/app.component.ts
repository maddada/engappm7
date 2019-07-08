import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonRouterOutlet, Platform, NavController, IonToggle } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './core/auth.service';
import { FcmService } from './core/fcm.service';
import { ShowToastService } from './core/show-toast.service';
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
    @ViewChild('notifToggle') notifToggle: IonToggle;
    ignoreOnChange: boolean;
    public username: string;

    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private storage: Storage,
        public auth: AuthService,
        private nav: NavController,
        public translate: TranslateService,
        public fcm: FcmService,
        private toast: ShowToastService,
    ) {
        this.initializeApp();
    }



    initializeApp() {
        this.platform.ready().then(() => {
            // this.checkFirstLaunch();
            this.getSetLanguage();
            this.getNotificationsSetting();
            this.statusBar.styleDefault();
            this.splashScreen.hide();
            this.fcm.getPermission().subscribe();
            this.fcm.listenToMessages().subscribe();
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

    async getNotificationsSetting(): Promise<any> {
        this.storage.get('notifications').then((val) => {
            if (val !== null) {
                // __ if notif setting set from before:
                // __ initialize toggle to stored value.
                console.log('here! 1');
                this.ignoreOnChange = true;
                this.notifToggle.checked = val;
                this.fcm.enabled = val;
                this.ignoreOnChange = false;
            } else {
                // __ if setting not set from before:
                // __ set it as off
                console.log('here! 2');
                this.ignoreOnChange = true;
                this.notifToggle.checked = false;
                this.storage.set('notifications', false);
                this.fcm.enabled = false;
                this.ignoreOnChange = false;
            }
        });
    }

    onToggleChange($event) {
        if (this.ignoreOnChange === true) {
            this.ignoreOnChange = false;
            return;
        }

        let isChecked = $event.detail.checked;
        // console.log($event.detail.checked);
        this.fcm.enabled = isChecked;
        this.platform.ready().then(() => {
            if (isChecked === true) {
                this.toast.showToast(`Enabling Notifications..`);
                this.fcm.sub('notifications');
                this.storage.set('notifications', true);
            } else {
                this.toast.showToast(`Disabling Notifications..`);
                this.fcm.unsub('notifications');
                this.storage.set('notifications', false);
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

    privacyPolicyClicked() {

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
