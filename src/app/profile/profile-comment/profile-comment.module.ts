import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ProfileCommentComponent } from './profile-comment.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule
  ],
  declarations: [ProfileCommentComponent],
  exports: [ProfileCommentComponent]
})
export class ProfileCommentModule { }
