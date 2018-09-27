import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchPage } from './search.page';
import { CompanyListElementModule } from '../../components/company-list-element/company-list-element.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    CompanyListElementModule,
    RouterModule.forChild([{ path: '', component: SearchPage }])
  ],
  declarations: [SearchPage]
})
export class SearchPageModule { }
