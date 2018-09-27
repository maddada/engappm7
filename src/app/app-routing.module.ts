import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { LoggedinGuard } from './core/loggedin.guard';


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
    // canActivate: [LoggedinGuard]
  },
  {
    path: 'register',
    loadChildren: './pages/login/register/register.module#RegisterPageModule',
    //  canActivate: [LoggedinGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: './pages/login/forgot-password/forgot-password.module#ForgotPasswordPageModule'
  },
  {
    path: 'logout',
    loadChildren: './pages/logout/logout.module#LogoutPageModule',
    // canActivate: [AuthGuard]
  }, //NOTE: CANT CREATE TENDER WHEN NOT LOGGED IN!!
  {
    path: 'create-tender', loadChildren: './tender/create-tender/create-tender.module#CreateTenderPageModule',
    // canActivate: [AuthGuard]
  },
  { path: 'wizard', loadChildren: './pages/wizard/wizard.module#WizardPageModule' },
  { path: 'view-tender/:id', loadChildren: './tender/view-tender/view-tender.module#ViewTenderPageModule' },
  { path: 'create-proposal', loadChildren: './proposal/create-proposal/create-proposal.module#CreateProposalPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
