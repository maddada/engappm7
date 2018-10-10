import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';

import { AuthService } from './auth.service';
import { FirestoreService } from './firestore.service';

import { AuthGuard } from '../guards/auth.guard';
import { LoggedinGuard } from '../guards/loggedin.guard';

import { ShowLoadingService } from './show-loading.service';
import { ShowToastService } from './show-toast.service';

import { SafeHtmlPipe } from '../pipes/safehtml.pipe';
import { FileSizePipe } from '../pipes/filesize.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SafeHtmlPipe,
    FileSizePipe,
  ],
  exports: [
    SafeHtmlPipe,
    FileSizePipe,
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
          ShowToastService,
          ShowLoadingService,
        ]
    };
  }
}
