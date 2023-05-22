import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  SignInComponent,
  SignUpComponent,
  ForgotPasswordComponent,
  VerifyEmailComponent,
  DashboardComponent
} from './components'

import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: '/sign-in', 
    pathMatch: 'full' 
  },
  { 
    path: 'sign-in', 
    component: SignInComponent 
  },
  { 
    path: 'register-user', 
    component: SignUpComponent 
  },
  { 
    path: 'forgot-password', 
    component: ForgotPasswordComponent 
  },
  { 
    path: 'verify-email-address', 
    component: VerifyEmailComponent 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
