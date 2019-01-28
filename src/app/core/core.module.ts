import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';

import { AuthGuard } from '../guards/auth.guard';
import { LoggedinGuard } from '../guards/loggedin.guard';
import { ConsultantOnlyGuard } from '../guards/consultant-only.guard';

import { ShowLoadingService } from './show-loading.service';
import { ShowToastService } from './show-toast.service';

// __ Ionic Native
import { TranslateModule } from '@ngx-translate/core';
import { Camera } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

// import { SafeHtmlPipe } from '../pipes/safehtml.pipe';
// import { FileSizePipe } from '../pipes/filesize.pipe';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: [
    // SafeHtmlPipe,
    // FileSizePipe,
  ],
  exports: [
    TranslateModule,
    // SafeHtmlPipe,
    // FileSizePipe,
  ],
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers:
        [
          AuthService,
          FirestoreService,
          AuthGuard,
          LoggedinGuard,
          ConsultantOnlyGuard,
          ShowToastService,
          ShowLoadingService,
          WebView,
          Camera,
        ]
    };
  }
}
