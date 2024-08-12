import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { addDoc, collection, doc, getFirestore, updateDoc } from 'firebase/firestore';
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
      this.router.navigate(['header/antropometria']);
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
        const studentClass = document.querySelector('#class') as HTMLSelectElement;
        const avaliation = document.querySelector('#avaliation1') as HTMLInputElement;
        const gender = document.querySelector('#gender') as HTMLSelectElement;
        const name = document.querySelector('#name') as HTMLInputElement;
        const weight = document.querySelector('#weight') as HTMLInputElement;
        const envergadura = document.querySelector('#envergadura') as HTMLInputElement;
        const saltoH = document.querySelector('#saltoH') as HTMLInputElement;
        const saltoV = document.querySelector('#saltoV') as HTMLInputElement;
        const corrida = document.querySelector('#corrida') as HTMLInputElement;
        const quadrado4x4 = document.querySelector('#quadrado4x4') as HTMLInputElement;
        const arremesso = document.querySelector('#arremesso') as HTMLInputElement;
        const caminhada = document.querySelector('#caminhada') as HTMLInputElement;
        const IMC = document.querySelector('#IMC') as HTMLInputElement;
        const estatura = document.querySelector('#estatura') as HTMLInputElement;
  
        //Passar os campos usados realmente no HTML para o await addDoc abaixo

        await addDoc(collection(this.db, 'antropometrias'), {
          studentId: this.student.id,
          name: name.value,
          studentClass: studentClass.value,
          avaliation: avaliation.value,
          gender: gender.value,
          weight: weight.value,
          envergadura: envergadura.value,
          saltoH: saltoH.value,
          saltoV: saltoV.value,
          corrida: corrida.value,
          quadrado4x4: quadrado4x4.value,
          arremesso: arremesso.value,
          caminhada: caminhada.value,
          estatura: estatura.value,
          IMC: IMC.value
        }).then(async () => {

          alert('Dados Salvos!');
          this.router.navigate(['header/antropometria']);

        });
        break;


    }
  }

  calcIMC(weight, estatura): number{
    return weight/estatura*2
  }

  updateIMC(): void{
    const IMC = document.querySelector('#IMC') as HTMLInputElement;
    const weight = document.querySelector('#weight') as HTMLInputElement;
    const estatura = document.querySelector('#estatura') as HTMLInputElement;
    IMC.value = this.calcIMC(weight.value, estatura.value).toString()
  }

  changeDetails() {
    
  }

}
