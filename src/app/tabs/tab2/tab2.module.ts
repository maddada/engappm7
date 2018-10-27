import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tab2Page } from './tab2.page';

import { TenderListElementModule } from '../../tender/tender-list-element/tender-list-element.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TenderListElementModule,
    TranslateModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }])
  ],

  declarations: [Tab2Page]
})
export class Tab2PageModule { }
