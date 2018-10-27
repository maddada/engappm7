import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { CompanyListElementModule } from '../../profile/company-list-element/company-list-element.module';
import { FilterModalPage } from './filter-modal/filter-modal.page';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CompanyListElementModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    TranslateModule,
  ],
  declarations: [
    Tab3Page,
    FilterModalPage
  ],
  entryComponents: [
    FilterModalPage
  ]
})
export class Tab3PageModule { }
