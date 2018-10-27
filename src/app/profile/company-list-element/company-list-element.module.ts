import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyListElementComponent } from './company-list-element.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule
  ],
  declarations: [
    CompanyListElementComponent
  ],
  exports: [
    CompanyListElementComponent
  ]
})
export class CompanyListElementModule { }
