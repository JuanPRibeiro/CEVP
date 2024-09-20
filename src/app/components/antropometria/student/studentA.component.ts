import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { addDoc, collection, doc, getDocs, getFirestore, orderBy, query, updateDoc, where } from 'firebase/firestore';
import * as DateFormat from 'src/app/shared/functions/dateFormat'
import { FirebaseStorage, getDownloadURL, getStorage, ref } from 'firebase/storage';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-studentA',
  templateUrl: './studentA.component.html',
  styleUrls: ['./studentA.component.css']
})
export class studentAComponent implements OnInit {

  protected antropometrias: any;

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

    //Front-end
    const sidebarCheck = document.querySelector("#check") as HTMLInputElement;
    let screenWidth = window.innerWidth;

    if (screenWidth >= 800) sidebarCheck.checked = true;

    this.getAntropometrias()
  }

  async getAntropometrias() {    
    const q = query(
      collection(this.db, 'antropometrias'),
      where('studentId', '==', this.student.id)
    );

    await getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
       this.antropometrias = doc.data()
      })
    })
    console.log(this.antropometrias)
  }
  

  async saveData() {
        switch(this.selectedData) {
      case 'initialData':
        const studentClass = document.querySelector('#class') as HTMLSelectElement;
        const avaliation = document.querySelector('#avaliation1') as HTMLInputElement;
        const gender = document.querySelector('#gender') as HTMLSelectElement;
        const name = document.querySelector('#name') as HTMLInputElement;
        const weight = document.querySelector('#weight') as HTMLInputElement;
        const envergadura = document.querySelector('#envergadura') as HTMLInputElement;
        const saltoH = document.querySelector('#saltoH') as HTMLInputElement;
        const corrida = document.querySelector('#corrida') as HTMLInputElement;
        const quadrado4x4 = document.querySelector('#quadrado4x4') as HTMLInputElement;
        const arremesso = document.querySelector('#arremesso') as HTMLInputElement;
        const caminhada = document.querySelector('#caminhada') as HTMLInputElement;
        const IMC = document.querySelector('#IMC') as HTMLInputElement;
        const estatura = document.querySelector('#estatura') as HTMLInputElement;
        const alcanceE = document.querySelector('#alcanceE') as HTMLInputElement;
        const alcanceA = document.querySelector('#alcanceA') as HTMLInputElement;
        const saltoV = document.querySelector('#saltoV') as HTMLInputElement

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
          corrida: corrida.value,
          quadrado4x4: quadrado4x4.value,
          arremesso: arremesso.value,
          caminhada: caminhada.value,
          estatura: estatura.value,
          IMC: IMC.value,
          alcanceE: alcanceE.value,
          alcanceA: alcanceA.value,
          saltoV: saltoV.value
        }).then(async () => {

          alert('Dados Salvos!');
          this.router.navigate(['header/antropometria']);

        });
        break;


      }
    }

    calcIMC(weight, estatura): number{
      return Math.ceil((weight / (estatura * estatura)))
    }

    updateIMC(): void {
      const IMC = document.querySelector('#IMC') as HTMLInputElement;
      const weight = document.querySelector('#weight') as HTMLInputElement;
      const estatura = document.querySelector('#estatura') as HTMLInputElement;
      IMC.value = this.calcIMC(weight.value, estatura.value).toString();
    }

    calcSaltoV(alcanceE, alcanceA): number{
      return (alcanceA - alcanceE)
    }

    updateSaltoV(): void {
      const saltoV = document.querySelector('#saltoV') as HTMLInputElement;
      const alcanceA = document.querySelector('#alcanceA') as HTMLInputElement;
      const alcanceE = document.querySelector('#alcanceE') as HTMLInputElement;
      const gender = document.querySelector('#gender') as HTMLInputElement;
      const age = document.querySelector('#age') as HTMLInputElement;
      saltoV.value = this.calcSaltoV(alcanceA.value, alcanceE.value).toString();
      const classificacao = document.querySelector('#classificarSaltoHorizontal') as HTMLParagraphElement;
      classificacao.textContent = this.classificarSaltoHorizontal(gender.value, age.value, saltoV.value);
    }

    classificarSaltoHorizontal(gender, age, saltoV): string {
      if (gender === "Feminino") {
        if (age == 10) {
          if (saltoV < 117.7) return "Fraco";
          if (saltoV <= 129.2) return "Razoavel";
          if (saltoV <= 143.3) return "Bom";
          if (saltoV <= 174) return "Muito Bom";
          if (saltoV >= 174.1) return "Excelente";
        } else if (age == 11) {
          if (saltoV < 123.9) return "Fraco";
          if (saltoV <= 135.8) return "Razoavel";
          if (saltoV <= 150.3) return "Bom";
          if (saltoV <= 181.7) return "Muito Bom";
          if (saltoV >= 181.8) return "Excelente";
        } else if (age == 12) {
          if (saltoV < 128) return "Fraco";
          if (saltoV <= 140.3) return "Razoavel";
          if (saltoV <= 155.3) return "Bom";
          if (saltoV <= 187.6) return "Muito Bom";
          if (saltoV >= 187.7) return "Excelente";
        } else if (age == 13) {
          if (saltoV < 130.8) return "Fraco";
          if (saltoV <= 143.7) return "Razoavel";
          if (saltoV <= 159.3) return "Bom";
          if (saltoV <= 193) return "Muito Bom";
          if (saltoV >= 193.1) return "Excelente";
        } else if (age == 14) {
          if (saltoV < 132) return "Fraco";
          if (saltoV <= 145.6) return "Razoavel";
          if (saltoV <= 161.9) return "Bom";
          if (saltoV <= 197.3) return "Muito Bom";
          if (saltoV >= 197.4) return "Excelente";
        } else if (age == 15) {
          if (saltoV < 131.8) return "Fraco";
          if (saltoV <= 146.2) return "Razoavel";
          if (saltoV <= 163.5) return "Bom";
          if (saltoV <= 200.7) return "Muito Bom";
          if (saltoV >= 200.8) return "Excelente";
        } else if (age == 16) {
          if (saltoV < 131.2) return "Fraco";
          if (saltoV <= 146.2) return "Razoavel";
          if (saltoV <= 164.3) return "Bom";
          if (saltoV <= 203.2) return "Muito Bom";
          if (saltoV >= 203.3) return "Excelente";
        } else if (age >= 17) {
          if (saltoV < 130.5) return "Fraco";
          if (saltoV <= 146.2) return "Razoavel";
          if (saltoV <= 165.1) return "Bom";
          if (saltoV <= 205.6) return "Muito Bom";
          if (saltoV >= 205.7) return "Excelente";
        }
      } else if (gender === "Masculino") {
        return "Masculino";
      }
      return "Erro";
    }


    changeDetails() {

    }

  }

