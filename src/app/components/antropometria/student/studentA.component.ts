import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import * as DateFormat from 'src/app/shared/functions/dateFormat'
import { FirebaseStorage, getDownloadURL, getStorage, ref } from 'firebase/storage';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-studentA',
  templateUrl: './studentA.component.html',
  styleUrls: ['./studentA.component.css']
})
export class studentAComponent implements OnInit {

  private db = getFirestore();
  private storage: FirebaseStorage = getStorage();
  
  private authorization: boolean = false;
  private responsibleTCLE: boolean = false;
  private studentTCLE: boolean = false;
  private TALE: boolean = false;

  protected student: any;
  protected schools: any[];
  protected selectedData: string = 'initialData';
  protected df: any = DateFormat;

  protected selectedAuthorizationFile: File;
  protected authorizationUrl: string;
  protected selectedResponsibleTCLEFile: File;
  protected responsibleTCLEUrl: string;
  protected selectedStudentTCLEFile: File;
  protected studentTCLEUrl: string;
  protected selectedTALEFile: File;
  protected taleUrl: string;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private angFireStorage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    //Data
    if (sessionStorage.getItem('student') === null || sessionStorage.getItem('schools') === null) {
      this.router.navigate(['header/students']);
      return;
    }

    this.student = JSON.parse(sessionStorage.getItem('student'));
    this.schools = JSON.parse(sessionStorage.getItem('schools'));

    this.student.birthdate = new Date(this.student.birthdate);

    //Files
    if(this.student.authorization){
      this.authorization = true;
      getDownloadURL(ref(this.storage, `authorizations/Autorizacao_${this.student.name}`)).then((url) => {
        this.authorizationUrl = url;
      })
    }
    if(this.student.responsibleTCLE){
      this.responsibleTCLE = true;
      getDownloadURL(ref(this.storage, `TCLEs/TCLE_Responsavel_${this.student.name}`)).then((url) => {
        this.responsibleTCLEUrl = url;
      })
    }
    if(this.student.studentTCLE){
      this.studentTCLE = true;
      getDownloadURL(ref(this.storage, `TCLEs/TCLE_Participante_${this.student.name}`)).then((url) => {
        this.studentTCLEUrl = url;
      })
    }
    if(this.student.tale){
      this.TALE = true;
      getDownloadURL(ref(this.storage, `TALEs/TALE_${this.student.name}`)).then((url) => {
        this.taleUrl = url;
      })
    }

    //Front-end
    const sidebarCheck = document.querySelector("#check") as HTMLInputElement;
    let screenWidth = window.innerWidth;

    if(screenWidth >= 800) sidebarCheck.checked = true;
  }

  onAuthorizationFileChanged(event: any): void {
    this.selectedAuthorizationFile = event.target.files[0];
    if(this.selectedAuthorizationFile) this.authorization = true;
  }

  onResponsibleTCLEFileChanged(event: any): void {
    this.selectedResponsibleTCLEFile = event.target.files[0];
    if(this.selectedResponsibleTCLEFile) this.responsibleTCLE = true;
  }

  onStudentTCLEFileChanged(event: any): void {
    this.selectedStudentTCLEFile = event.target.files[0];
    if(this.selectedStudentTCLEFile) this.studentTCLE = true;
  }

  onTALEFileChanged(event: any): void {
    this.selectedTALEFile = event.target.files[0];
    if(this.selectedTALEFile) this.TALE = true;
  }

  onViewAuthorizationFile() {
    window.open(this.authorizationUrl, '_blank');
  }

  onViewResponsibleTCLEFile() {
    window.open(this.responsibleTCLEUrl, '_blank');
  }

  onViewStudentTCLEFile() {
    window.open(this.studentTCLEUrl, '_blank');
  }

  onViewTALEFile() {
    window.open(this.taleUrl, '_blank');
  }

  async saveData() {
    switch (this.selectedData) {
      case 'initialData':
        const birthdate = document.querySelector('#birthdate') as HTMLInputElement;
        const studentClass = document.querySelector('#class') as HTMLSelectElement;
        const contact = document.querySelector('#contact') as HTMLInputElement;
        const gender = document.querySelector('#gender') as HTMLSelectElement;
        const name = document.querySelector('#name') as HTMLInputElement;
        const parent = document.querySelector('#parent') as HTMLInputElement;
        const parentContact = document.querySelector('#parentContact') as HTMLInputElement;
        const parentName = document.querySelector('#parentName') as HTMLInputElement;
        const schoolId = document.querySelector('#schoolId') as HTMLInputElement;
        let processedDate = new Date(birthdate.value);

        processedDate.setDate(processedDate.getDate() + 1);

        updateDoc(doc(this.db, 'students', this.student.id), {
          authorization: this.authorization,
          birthdate: processedDate,
          class: studentClass.value,
          contact: contact.value,
          gender: gender.value,
          name: name.value,
          parent: parent.value,
          parentContact: parentContact.value,
          parentName: parentName.value,
          responsibleTCLE: this.responsibleTCLE,
          schoolId: schoolId.value,
          studentTCLE: this.studentTCLE,
          tale: this.TALE
        }).then(async () => {
          if(this.selectedAuthorizationFile) await this.angFireStorage.upload(`authorizations/Autorizacao_${name.value}`, this.selectedAuthorizationFile);
          if(this.selectedResponsibleTCLEFile) await this.angFireStorage.upload(`TCLEs/TCLE_Responsavel_${name.value}`, this.selectedResponsibleTCLEFile);
          if(this.selectedStudentTCLEFile) await this.angFireStorage.upload(`TCLEs/TCLE_Participante_${name.value}`, this.selectedStudentTCLEFile);
          if(this.selectedTALEFile) await this.angFireStorage.upload(`TALEs/TALE_${name.value}`, this.selectedTALEFile);
          
          alert('Dados Salvos!');
          this.router.navigate(['header/students']);
        });
        break;
    }
  }

  changeDetails() {
    
  }

}
