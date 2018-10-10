import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ViewProfilePage } from './view-profile.page';

import { ProfileElementModule } from '../profile-element/profile-element.module';

import { ProfileCommentModule } from '../profile-comment/profile-comment.module';
import { TenderListElementModule } from '../../tender/tender-list-element/tender-list-element.module';


const routes: Routes = [
  {
    path: '',
    component: ViewProfilePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileElementModule,
    ProfileCommentModule,
    TenderListElementModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ViewProfilePage]
})
export class ViewProfilePageModule { }
