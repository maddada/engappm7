import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { LoggedinGuard } from './core/loggedin.guard';



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
    loadChildren: './settings/settings.module#SettingsPageModule'
  },
  {
    path: 'select-language',
    loadChildren: './select-lang/select-lang.module#SelectLangPageModule'
  },
  {
    path: 'login',
    loadChildren: './login/login.module#LoginPageModule', canActivate: [LoggedinGuard]
  },
  {
    path: 'register',
    loadChildren: './register/register.module#RegisterPageModule', canActivate: [LoggedinGuard]
  },
  {
    path: 'forgot-password',
    loadChildren: './login/forgot-password/forgot-password.module#ForgotPasswordPageModule'
  },
  {
    path: 'logout',
    loadChildren: './logout/logout.module#LogoutPageModule', canActivate: [AuthGuard]
  },
  { path: 'create-tender', loadChildren: './tender/create-tender/create-tender.module#CreateTenderPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
