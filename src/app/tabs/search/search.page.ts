import { Component, OnInit } from '@angular/core';
import { User } from '../../../model';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss']
})
export class SearchPage implements OnInit {

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

  ngOnInit() {

  }

  public onSelectSupplierCategory($event): any {

    // if ($event.detail.value.length > 0) {
    //   this.selectedSupplierCategories = $event.detail.value;
    //   this.newUser.supplierCategory = this.selectedSupplierCategories;
    // }

  }

  public onClickSearch(): any { }

}
