import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CreateProposalPage } from './create-proposal.page';

const routes: Routes = [
  {
    path: '',
    component: CreateProposalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreateProposalPage]
})
export class CreateProposalPageModule {}
