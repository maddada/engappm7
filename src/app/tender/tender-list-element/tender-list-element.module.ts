import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenderListElementComponent } from './tender-list-element.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
  ],
  declarations: [
    TenderListElementComponent
  ],
  exports: [
    TenderListElementComponent
  ]
})
export class TenderListElementModule { }
