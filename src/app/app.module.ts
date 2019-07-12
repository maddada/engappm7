import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

// __ Ionic Native
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Firebase } from '@ionic-native/firebase/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Firestarter App Modules
import { CoreModule } from './core/core.module';

// AngularFire2 Modules
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

import { environment } from '../environments/environment';

// import ngx-translate and the http loader
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { TenderListElementModule } from './tender/tender-list-element/tender-list-element.module';
import { CompanyListElementModule } from './profile/company-list-element/company-list-element.module';
import { ProfileElementModule } from './profile/profile-element/profile-element.module';
import { ServiceWorkerModule } from '@angular/service-worker';

import { FcmService } from './core/fcm.service';

import { File } from '@ionic-native/file/ngx';
import { PrivacyPageModule } from './pages/privacy/privacy.module';
import { PrivacyPage } from './pages/privacy/privacy.page';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [PrivacyPage],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        IonicModule.forRoot({
            mode: 'ios', // Makes top text center. and icons better looking
            backButtonText: 'Back',
            // modalEnter: 'modal-slide-in',
            // modalLeave: 'modal-slide-out',
        }),
        IonicStorageModule.forRoot(),
        CoreModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        AngularFireFunctionsModule,
        TenderListElementModule,
        CompanyListElementModule,
        AngularFireMessagingModule,
        ProfileElementModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        PrivacyPageModule,
        // AngularFirestoreModule.enablePersistence(),
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        Firebase,
        FcmService,
        File,
        FileTransfer
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        private afs: AngularFirestore
    ) {
        // afs.firestore.settings({
        //   // timestampsInSnapshots: true,
        // });
        // LATER: Enable Persistence *MAYBE! It was causing problems with desynced data!
        afs.firestore.enablePersistence();
    }

}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
