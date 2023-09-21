import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getDoc, doc, addDoc, collection, getFirestore } from "firebase/firestore";

@Component({
  selector: 'app-create-student-dlg',
  templateUrl: './create-student-dlg.component.html',
  styleUrls: ['./create-student-dlg.component.css']
})
export class CreateStudentDLGComponent implements OnInit {
  private db = getFirestore();
  protected schools: any[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { schools: any[] },
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateStudentDLGComponent>
  ) {
    this.schools = this.data.schools;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async createStudent() {
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

    await addDoc(collection(this.db, 'students'), {
      activated: true,
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
      if (confirm('Participante Cadastrado!\nRecarregar os dados?')){
        window.location.reload();
      } else {
        this.dialogRef.close();
      }
    })
  }
}
