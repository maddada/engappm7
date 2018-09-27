import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
import { ContactPage } from './contact.page';

import { TenderListElementModule } from '../../tender/tender-list-element/tender-list-element.module';


@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TenderListElementModule,
    // FormsModule,
    RouterModule.forChild([{ path: '', component: ContactPage }])
  ],

  declarations: [ContactPage]
})
export class ContactPageModule { }
