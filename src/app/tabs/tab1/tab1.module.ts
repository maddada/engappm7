import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TenderListElementModule } from '../../tender/tender-list-element/tender-list-element.module';
import { Tab1Page } from './tab1.page';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TenderListElementModule,
    TranslateModule,
    RouterModule.forChild([
      {
        path: '',
        component: Tab1Page
      }
    ]),
    // TenderListElementModule
  ],
  declarations: [Tab1Page],

})
export class Tab1PageModule { }
