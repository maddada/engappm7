import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';


const routes: Routes = [
  {
    path: '',
    loadChildren: './tabs/tabs.module#TabsPageModule',
    // canActivate: [AuthGuard]
  },
  {
    path: 'home',
    redirectTo: '/tabs/(home:home)',
    pathMatch: 'full'
  },
  // {
  //   path: '',
  //   redirectTo: 'home',
  //   pathMatch: 'full'
  // },
  // {
  //   path: 'home',
  //   loadChildren: './home/home.module#HomePageModule'
  // },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsPageModule'
  },
  { path: 'select-language', loadChildren: './select-lang/select-lang.module#SelectLangPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'user', loadChildren: './profile/user/user.module#UserPageModule' },
  { path: 'company', loadChildren: './profile/company/company.module#CompanyPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
