import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenderListElementComponent } from './tender-list-element.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
  ],
  declarations: [
    TenderListElementComponent
  ],
  exports: [
    TenderListElementComponent
  ]
})
export class TenderListElementModule { }
