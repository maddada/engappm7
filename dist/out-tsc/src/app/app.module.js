"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
// import { RouterModule, RouteReuseStrategy, Routes } from '@angular/router';
var router_1 = require("@angular/router");
var angular_1 = require("@ionic/angular");
var ngx_1 = require("@ionic-native/splash-screen/ngx");
var ngx_2 = require("@ionic-native/status-bar/ngx");
var app_component_1 = require("./app.component");
var app_routing_module_1 = require("./app-routing.module");
// Firestarter App Modules
var core_module_1 = require("./core/core.module");
// AngularFire2 Modules
var angularfire2_1 = require("angularfire2");
var firestore_1 = require("angularfire2/firestore");
var storage_1 = require("angularfire2/storage");
var auth_1 = require("angularfire2/auth");
var functions_1 = require("angularfire2/functions");
var firestore_service_1 = require("./core/firestore.service");
var environment_1 = require("../environments/environment");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [app_component_1.AppComponent],
            entryComponents: [],
            imports: [
                platform_browser_1.BrowserModule,
                angular_1.IonicModule.forRoot(),
                app_routing_module_1.AppRoutingModule,
                core_module_1.CoreModule,
                angularfire2_1.AngularFireModule.initializeApp(environment_1.environment.firebase, 'firestarter'),
                firestore_1.AngularFirestoreModule,
                auth_1.AngularFireAuthModule,
                storage_1.AngularFireStorageModule,
                functions_1.AngularFireFunctionsModule,
            ],
            providers: [
                ngx_2.StatusBar,
                ngx_1.SplashScreen,
                firestore_service_1.FirestoreService,
                { provide: router_1.RouteReuseStrategy, useClass: angular_1.IonicRouteStrategy },
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map