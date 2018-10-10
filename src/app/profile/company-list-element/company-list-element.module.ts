import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyListElementComponent } from './company-list-element.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [
    CompanyListElementComponent
  ],
  exports: [
    CompanyListElementComponent
  ]
})
export class CompanyListElementModule { }
