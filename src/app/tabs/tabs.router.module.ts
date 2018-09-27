import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { HomePage } from './home/home.page';
import { SearchPage } from './search/search.page';
import { ContactPage } from './posted/contact.page';
import { ProfilePage } from './profile/profile.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        outlet: 'home',
        component: HomePage
      },
      {
        path: 'search',
        outlet: 'search',
        component: SearchPage
      },
      {
        path: 'contact',
        outlet: 'contact',
        component: ContactPage
      },
      {
        path: 'profile',
        outlet: 'profile',
        component: ProfilePage
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(home:home)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
