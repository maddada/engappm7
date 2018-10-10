import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ProfileElementComponent } from './profile-element.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [
    ProfileElementComponent,
  ],
  exports: [
    ProfileElementComponent,
  ]
})
export class ProfileElementModule { }
