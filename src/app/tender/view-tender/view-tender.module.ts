import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewTenderPage } from './view-tender.page';

import { CompanyListElementModule } from '../../profile/company-list-element/company-list-element.module';
import { TenderListElementModule } from '../tender-list-element/tender-list-element.module';

const routes: Routes = [
  {
    path: '',
    component: ViewTenderPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TenderListElementModule,
    CompanyListElementModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewTenderPage]
})
export class ViewTenderPageModule { }
