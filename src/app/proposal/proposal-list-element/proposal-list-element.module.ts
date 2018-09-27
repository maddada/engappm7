import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProposalListElementComponent } from './proposal-list-element.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule
  ],
  declarations: [
    ProposalListElementComponent
  ],
  exports: [
    ProposalListElementComponent
  ]
})
export class ProposalListElementModule { }
