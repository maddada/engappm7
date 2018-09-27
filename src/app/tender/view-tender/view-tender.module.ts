import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewTenderPage } from './view-tender.page';
import { TenderListElementModule } from '../tender-list-element/tender-list-element.module';
import { CompanyListElementModule } from '../../components/company-list-element/company-list-element.module';

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
