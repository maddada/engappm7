import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
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
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireFunctionsModule } from '@angular/fire/functions';

import { AuthService } from './core/auth.service';

// import { FirestoreService } from './core/firestore.service';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios', // M7: This is really imp. makes top text center. and icons better looking
      backButtonText: 'Back',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
    }),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    CoreModule.forRoot(),
    // AngularFireModule.initializeApp(environment.firebase, 'firestarter'),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AuthService,
    // FirestoreService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
