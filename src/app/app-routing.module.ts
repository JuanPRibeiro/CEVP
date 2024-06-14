import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  SignInComponent,
  SignUpComponent,
  ForgotPasswordComponent,
  VerifyEmailComponent,
  DashboardComponent,
  ProfileComponent,
  StudentsComponent,
  StudentComponent,
  FrequencyComponent,
  AntropometriaComponent,
  studentAComponent
} from './components'

import { AuthGuard } from './shared/guard/auth.guard';
import { HeaderComponent } from './components/header/header.component';

const routes: Routes = [
  //Default
  { 
    path: '', 
    redirectTo: '/header/dashboard', 
    pathMatch: 'full' 
  },

  //Authentication
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

  //Authenticated
  {
    path: 'header',
    component: HeaderComponent,
    children: [
      { 
        path: 'dashboard', 
        component: DashboardComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'students',
        component: StudentsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'antropometria',
        component: AntropometriaComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'antropometria/studentA',
        component: studentAComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'students/student',
        component: StudentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'frequency',
        component: FrequencyComponent,
        canActivate: [AuthGuard]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
