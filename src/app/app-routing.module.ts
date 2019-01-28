import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoggedinGuard } from './guards/loggedin.guard';
import { ConsultantOnlyGuard } from './guards/consultant-only.guard';


//NOTE: AuthGuard = Not logged in! (ex: Can't logout)
//NOTE: LoggedinGuard = Already logged in! (ex: Can't log in)
const routes: Routes = [
  {
    path: '',
    loadChildren: './tabs/tabs.module#TabsPageModule',
  },
  {
    path: 'home',
    redirectTo: '/tabs/(home:home)',
    pathMatch: 'full'
  },
  {
    path: 'settings',
    loadChildren: './pages/settings/settings.module#SettingsPageModule'
  },
  {
    path: 'select-language',
    loadChildren: './pages/select-lang/select-lang.module#SelectLangPageModule'
  },
  {
    path: 'login',
    loadChildren: './pages/login/login.module#LoginPageModule',
    canActivate: [LoggedinGuard]
  },
  {
    path: 'register',
    redirectTo: '/select-type',
    pathMatch: 'full'
  },
  {
    path: 'register/:type',
    loadChildren: './pages/login/register/register.module#RegisterPageModule',
    canActivate: [LoggedinGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: './pages/login/forgot-password/forgot-password.module#ForgotPasswordPageModule'
  },
  {
    path: 'logout',
    loadChildren: './pages/logout/logout.module#LogoutPageModule',
    canActivate: [AuthGuard]
  }, //NOTE: CANT CREATE TENDER WHEN NOT LOGGED IN!!
  {
    path: 'create-tender', loadChildren: './tender/create-tender/create-tender.module#CreateTenderPageModule',
    canActivate: [ConsultantOnlyGuard]
  },
  { path: 'wizard', loadChildren: './pages/wizard/wizard.module#WizardPageModule' },
  { path: 'view-tender/:id', loadChildren: './tender/view-tender/view-tender.module#ViewTenderPageModule' },
  { path: 'view-profile/:id', loadChildren: './profile/view-profile/view-profile.module#ViewProfilePageModule' },
  { path: 'rate/:id', loadChildren: './profile/rate/rate.module#RatePageModule' },
  { path: 'select-acc-type', loadChildren: './pages/select-acc-type/select-acc-type.module#SelectAccTypePageModule' },
  { path: 'select-indv-company', loadChildren: './pages/select-indv-company/select-indv-company.module#SelectIndvCompanyPageModule' },
  { path: 'wizard-ar', loadChildren: './pages/wizard-ar/wizard-ar.module#WizardArPageModule' },  { path: 'notifications', loadChildren: './pages/notifications/notifications.module#NotificationsPageModule' },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
