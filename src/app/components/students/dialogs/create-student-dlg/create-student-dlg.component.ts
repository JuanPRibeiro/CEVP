import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { addDoc, collection, getFirestore } from "firebase/firestore";

@Component({
  selector: 'app-create-student-dlg',
  templateUrl: './create-student-dlg.component.html',
  styleUrls: ['./create-student-dlg.component.css']
})
export class CreateStudentDLGComponent implements OnInit {
  private db = getFirestore();

  protected schools: any[];

  protected authorization: boolean = false;
  protected responsibleTCLE: boolean = false;
  protected studentTCLE: boolean = false;
  protected TALE: boolean = false;

  protected selectedAuthorizationFile: File;
  protected selectedResponsibleTCLEFile: File;
  protected selectedStudentTCLEFile: File;
  protected selectedTALEFile: File;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { schools: any[] },
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateStudentDLGComponent>,
    private storage: AngularFireStorage
  ) {
    this.schools = this.data.schools;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAuthorizationFileChanged(event: any): void {
    this.selectedAuthorizationFile = event.target.files[0];
    if (this.selectedAuthorizationFile) this.authorization = true;
  }

  onResponsibleTCLEFileChanged(event: any): void {
    this.selectedResponsibleTCLEFile = event.target.files[0];
    if (this.selectedResponsibleTCLEFile) this.responsibleTCLE = true;
  }

  onStudentTCLEFileChanged(event: any): void {
    this.selectedStudentTCLEFile = event.target.files[0];
    if (this.selectedStudentTCLEFile) this.studentTCLE = true;
  }

  onTALEFileChanged(event: any): void {
    this.selectedTALEFile = event.target.files[0];
    if (this.selectedTALEFile) this.TALE = true;
  }

  async createStudent(): Promise<void> {
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
      authorization: this.authorization,
      birthdate: processedDate,
      class: studentClass.value,
      contact: contact.value,
      deactivationReason: "",
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
      if (this.selectedAuthorizationFile) await this.storage.upload(`authorizations/Autorizacao_${name.value}`, this.selectedAuthorizationFile);
      if (this.selectedResponsibleTCLEFile) await this.storage.upload(`TCLEs/TCLE_Responsavel_${name.value}`, this.selectedResponsibleTCLEFile);
      if (this.selectedStudentTCLEFile) await this.storage.upload(`TCLEs/TCLE_Participante_${name.value}`, this.selectedStudentTCLEFile);
      if (this.selectedTALEFile) await this.storage.upload(`TALEs/TALE_${name.value}`, this.selectedTALEFile);

      if (confirm('Participante Cadastrado!\nRecarregar os dados?')) {
        window.location.reload();
      } else {
        this.dialogRef.close();
      }
    })
  }
}
