import { Component, OnInit } from '@angular/core';
import { User, SearchFilter, city, M7LoadingOptions } from '../../../model';
import { FilterModalPage } from './filter-modal/filter-modal.page';
import { ModalController, LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../core/firestore.service';
import { take } from 'rxjs/internal/operators/take';
import { ShowLoadingService } from '../../core/show-loading.service';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage implements OnInit {

  companies: User[];
  companies$: Observable<User[]>;

  filterOptions: SearchFilter;

  constructor(private modal: ModalController, private db: FirestoreService, private loadingCtrl: LoadingController) {

  }

  async ngOnInit() {

    const showLoading = await this.loadingCtrl.create(new M7LoadingOptions);
    await showLoading.present();

    this.filterOptions = {
      searchString: '',
      city: 0,
      tag: '',
    };

    this.companies$ = this.db.col$('users').pipe(take(1));

    this.companies$.subscribe(res => {
      this.companies = res;
      showLoading.dismiss();
    });
  }

  async onClickFilterSearch() {
    const modal = await this.modal.create({
      component: FilterModalPage,
      componentProps: { filterOptions: this.filterOptions }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.filterOptions = data;
      this.startSearch();
    }
  }

  public async startSearch() {

    const showLoading = await this.loadingCtrl.create(new M7LoadingOptions);
    await showLoading.present();

    console.log(this.filterOptions);

    if (this.filterOptions.city !== 0) {
      this.companies$ = this.db.col$('users', ref => ref.where('city', '==', this.filterOptions.city));
    } else if (this.filterOptions.city === 0) {
      this.companies$ = this.db.col$('users');
    }

    await this.companies$.subscribe(res => {
      if (res == null) { return; }

      if (res.length > 0) {
        // _: Make sure it only shows companies!
        res = res.filter(element => {
          if (element.tags != null) {
            return element.tags.includes('company');
          }
          else {
            return false;
          }
        });

        // _: Filter according to the search string (name of company)
        if (res.length > 0 && this.filterOptions.searchString != null && this.filterOptions.searchString !== '') {
          res = res.filter(element => {
            if (element.profileName != null) {
              return element.profileName.includes(this.filterOptions.searchString);
            } else {
              return false;
            }
          });
        }

        // _: Filter according to the tag (tags array contains)
        if (res.length > 0 && this.filterOptions.tag != null && this.filterOptions.tag !== '') {
          if (res.length > 0) {
            res = res.filter(element => {
              if (element.tags != null) {
                return element.tags.includes(this.filterOptions.tag);
              }
              else {
                return false;
              }
            });
          }
        }
      }

      this.companies = res;

      console.log(this.companies);

    });


    await showLoading.dismiss();


  }

}



/*

  companies: User[] = [
    {
      profileName: 'Tiger Consulting',
      city: 1,
      accountType: 2,
      companyNumber: '061251516',
      email: 'info@test.ae',
      class: 1,
      TEST_RATING: 5,
      tags: ['company_consultant'],
    },
    {
      profileName: 'Al Samer Contracting',
      city: 4,
      accountType: 3,
      companyNumber: '061251516',
      email: 'info@test.ae',
      class: 2,
      TEST_RATING: 3,
      tags: ['company_consultant'],
    },
    {
      profileName: 'Sharqiya Building Supplies',
      city: 2,
      accountType: 4,
      companyNumber: '061251516',
      email: 'info@test.ae',
      class: 3,
      TEST_RATING: 4,
      tags: ['company_consultant'],
    },
    {
      profileName: 'Carting Consulting',
      city: 1,
      accountType: 3,
      companyNumber: '061251516',
      email: 'info@test.ae',
      class: 5,
      TEST_RATING: 4,
      tags: ['company_consultant'],
    },
    {
      profileName: 'Wathba Consulting',
      city: 3,
      accountType: 4,
      companyNumber: '061251516',
      email: 'info@test.ae',
      class: 2,
      TEST_RATING: 3,
      tags: ['company_consultant'],
    },
    {
      profileName: 'AON Management Consulting',
      city: 8,
      accountType: 3,
      companyNumber: '061251516',
      email: 'info@test.ae',
      class: 4,
      TEST_RATING: 2,
      tags: ['company_consultant'],
    },
    {
      profileName: 'Al Samer Consulting',
      city: 6,
      accountType: 2,
      companyNumber: '061251516',
      email: 'info@test.ae',
      class: 3,
      TEST_RATING: 5,
      tags: ['company_consultant'],
    },
  ];

  */
