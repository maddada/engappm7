import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { FirestoreService } from './firestore.service';


import { LoadingSpinnerComponent } from '../ui/loading-spinner/loading-spinner.component';

import { SafeHtmlPipe } from '../pipes/safehtml.pipe';
import { FileSizePipe } from '../pipes/filesize.pipe';

import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    LoadingSpinnerComponent,
    SafeHtmlPipe,
    FileSizePipe,
  ],
  exports: [
    LoadingSpinnerComponent,
    SafeHtmlPipe,
    FileSizePipe,
  ],
  providers: [AuthService, AuthGuard, FirestoreService]
})
export class CoreModule { }

