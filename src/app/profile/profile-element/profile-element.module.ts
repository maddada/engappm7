import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ProfileElementComponent } from './profile-element.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule,
    FormsModule,
  ],
  declarations: [
    ProfileElementComponent,
  ],
  exports: [
    ProfileElementComponent,
  ]
})
export class ProfileElementModule { }
