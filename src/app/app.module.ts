import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicStorageModule } from '@ionic/storage';

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

import { environment } from '../environments/environment';

import { TenderListElementModule } from './tender/tender-list-element/tender-list-element.module';
import { CompanyListElementModule } from './profile/company-list-element/company-list-element.module';
import { ProfileElementModule } from './profile/profile-element/profile-element.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios', // Makes top text center. and icons better looking
      backButtonText: 'Back',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
    }),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    CoreModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    // AngularFirestoreModule.enablePersistence(),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    TenderListElementModule,
    CompanyListElementModule,
    ProfileElementModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private afs: AngularFirestore) {
    afs.firestore.settings({
      timestampsInSnapshots: true,
    });
    //afs.firestore.enablePersistence();
  }
}
