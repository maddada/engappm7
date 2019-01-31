import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../../model';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import { FirestoreService } from '../../core/firestore.service';

@Component({
  selector: 'app-profile-element',
  templateUrl: './profile-element.component.html',
  styleUrls: ['./profile-element.component.scss']
})
export class ProfileElementComponent implements OnInit {



  @Input() user: User;
  @Input() allowEdit: boolean;



  constructor(private nav: NavController, public translate: TranslateService, private db: FirestoreService) { }


  public editMode: boolean = false;

  updatedUser: User = {};
  // profileName
  // companyNumber
  // class -> LATER FROM onSelect

  selectedClass: any;
  selectedSupplierCategories: string[] = [];
  companyNumber: any;

  ngOnInit() {


    // TODO: Use Cloud Functions to set rating for a user
    // temp:
    // this.user.rating = 4;

  }

  public cancle() {
    this.editMode = false;
  }

  // public goBack() {
  //   this.nav.goBack();
  // }

  public toggleEditOn() {
    this.editMode = true;

    this.updatedUser = {};

    this.updatedUser.tags = [];
    this.setTags();

    this.selectedClass = '' + this.user.class;
    this.updatedUser.profileName = this.user.profileName;
    this.updatedUser.profileNameAr = this.user.profileNameAr;
    this.updatedUser.companyNumber = this.user.companyNumber;
    this.updatedUser.address = this.user.address;
  }


  // TODO: #NET: Check if this component's update stuff works right!
  // _: I think it should work great (minor bugs maybe), but I couldn't test!
  public saveUpdate() {
    this.db.upsertTS(`users/${this.user.uid}`, this.updatedUser);
    this.editMode = false;
  }

  public onSelectClass(event) {
    this.updatedUser.class = Number(this.selectedClass);
  }

  public onSelectSupplierCategory($event): any {

    if ($event.detail.value.length > 0) {
      this.selectedSupplierCategories = $event.detail.value;
      this.updatedUser.tags = [... this.selectedSupplierCategories];
    }

  }

  public setTags() {
    switch (this.user.accountType) {
      case 1:
        this.updatedUser.tags.push('individual');
        break;

      case 2:
        this.updatedUser.tags.push('company');
        this.updatedUser.tags.push('company_consultant');
        break;

      case 3:
        this.updatedUser.tags.push('company');
        this.updatedUser.tags.push('company_contractor');
        break;

      case 4:
        this.updatedUser.tags.push('company');
        this.updatedUser.tags.push('company_supplier');
        break;

      default:
        break;
    }

    //NOTE: Set City Tags
    switch (this.user.city) {
      case 1:
        this.updatedUser.tags.push('dxb');
        break;

      case 2:
        this.updatedUser.tags.push('shj');
        break;

      case 3:
        this.updatedUser.tags.push('ajman');
        break;

      case 4:
        this.updatedUser.tags.push('ad');
        break;

      case 5:
        this.updatedUser.tags.push('ain');
        break;

      case 6:
        this.updatedUser.tags.push('fujaira');
        break;

      case 7:
        this.updatedUser.tags.push('rak');
        break;

      case 8:
        this.updatedUser.tags.push('umq');
        break;

      default:
        break;
    }
  }

}
