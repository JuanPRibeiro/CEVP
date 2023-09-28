import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import * as DateFormat from 'src/app/shared/functions/dateFormat'
import { DeactivateStudentDlgComponent } from '../dialogs/deactivate-student-dlg/deactivate-student-dlg.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  private db = getFirestore();
  protected student: any;
  protected schools: any[];
  protected selectedData: string = 'initialData';
  protected df: any = DateFormat;

  constructor(
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('student') === null || sessionStorage.getItem('schools') === null) {
      this.router.navigate(['header/students']);
      return;
    }
    this.student = JSON.parse(sessionStorage.getItem('student'));
    this.schools = JSON.parse(sessionStorage.getItem('schools'));
    this.student.birthdate = new Date(this.student.birthdate);
  }

  changeDetails() {

  }

  async saveData() {
    switch (this.selectedData) {
      case 'initialData':
        const authorization = document.querySelector('#authorization') as HTMLSelectElement;
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
          authorization: authorization.value == 'Sim' ? true : false,
          birthdate: processedDate,
          class: studentClass.value,
          contact: contact.value,
          gender: gender.value,
          name: name.value,
          parent: parent.value,
          parentContact: parentContact.value,
          parentName: parentName.value,
          schoolId: schoolId.value
        }).then(() => {
          alert('Dados Salvos!');
        });
        break;
    }
  }

  openDialogDeactivateStudent() {
    const dialogRef = this.dialog.open(DeactivateStudentDlgComponent, {
      width: '40%',
      data: {
        
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== false) this.deactivateStudent(result);
    });
  }

  async deactivateStudent(reason: String) {
    await updateDoc(doc(this.db, 'students', this.student.id), {
      activated: false,
      deactivationReason: reason
    });
    
    alert('Participante arquivado.');
    this.router.navigate(['header/students']);
  }

  async activateStudent() {
    await updateDoc(doc(this.db, 'students', this.student.id), {
      activated: true
    });

    alert('Participante reativado!');
    this.router.navigate(['header/students']);
  }
}
