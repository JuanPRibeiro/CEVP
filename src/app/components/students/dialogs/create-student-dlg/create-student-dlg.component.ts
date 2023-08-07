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
    const name = document.querySelector('#name') as HTMLInputElement;
    const birthdate = document.querySelector('#birthdate') as HTMLInputElement;
    const studentClass = document.querySelector('#class') as HTMLSelectElement;
    const schoolId = document.querySelector('#school') as HTMLSelectElement;
    let processedDate = new Date(birthdate.value);

    processedDate.setDate(processedDate.getDate()+1);

    await addDoc(collection(this.db, "students"), {
      name: name.value,
      birthdate: processedDate,
      class: studentClass.value,
      schoolId: schoolId.value
    }).then(() => {
      window.location.reload();
    })
  }
}
