import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* 
Imports do Angular Material. Para não importar Modules desnecessários,
descomentar o import a seguir e nos imports dentro do NgModule abaixo conforme necessário 
*/
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
//import { MatMenuModule } from '@angular/material/menu';
//import { MatButtonModule } from '@angular/material/button';
//import { MatDividerModule } from '@angular/material/divider';
//import { MatInputModule } from '@angular/material/input';
//import { MatCardModule } from '@angular/material/card';
//import { MatChipsModule } from '@angular/material/chips';
//import { MatSelectModule } from '@angular/material/select';
//import { MatExpansionModule } from '@angular/material/expansion';
//import { MatGridListModule } from '@angular/material/grid-list';
//import { MatCheckboxModule } from '@angular/material/checkbox';

// Firebase services + environment module
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment';

import { AuthService } from './shared/services/auth.service';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/authentication/sign-in/sign-in.component';
import { SignUpComponent } from './components/authentication/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/authentication/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/authentication/verify-email/verify-email.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HeaderComponent } from './components/header/header.component';
import { StudentsComponent } from './components/students/students.component';
import { CreateStudentDLGComponent } from './components/students/dialogs/create-student-dlg/create-student-dlg.component';
import { FrequencyComponent } from './components/frequency/frequency.component';
import { CreateLessonDlgComponent } from './components/frequency/dialogs/create-lesson-dlg/create-lesson-dlg.component';
import { StudentComponent } from './components/students/student/student.component';
import { EditLessonDlgComponent } from './components/frequency/dialogs/edit-lesson-dlg/edit-lesson-dlg.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    ProfileComponent,
    HeaderComponent,
    StudentsComponent,
    CreateStudentDLGComponent,
    FrequencyComponent,
    CreateLessonDlgComponent,
    StudentComponent,
    EditLessonDlgComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    //MatButtonModule,
    //MatCardModule,
    //MatCheckboxModule,
    //MatChipsModule,
    //MatDividerModule,
    //MatExpansionModule,
    //MatGridListModule,
    //MatInputModule,
    //MatMenuModule,
    //MatSelectModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
