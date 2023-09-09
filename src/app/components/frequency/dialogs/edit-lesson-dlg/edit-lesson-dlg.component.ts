import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Firestore, deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import * as DateFormat from 'src/app/shared/functions/dateFormat'

@Component({
  selector: 'app-edit-lesson-dlg',
  templateUrl: './edit-lesson-dlg.component.html',
  styleUrls: ['./edit-lesson-dlg.component.css']
})
export class EditLessonDlgComponent implements OnInit {
  protected lesson: any;
  private  df: any = DateFormat;
  private dateInput: HTMLInputElement;
  private db: Firestore;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { lesson: any[] },
    private dialogRef: MatDialogRef<EditLessonDlgComponent>,
  ) { 
    this.lesson = data.lesson;
    this.db = getFirestore();
  }
  
  ngOnInit(): void {
    this.dateInput = document.querySelector('#date') as HTMLInputElement;
    this.dateInput.value = `${this.lesson.date.getFullYear()}-${this.df.returnData(this.lesson.date.getMonth()+1)}-${this.df.returnData(this.lesson.date.getDate())}`;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  
  async saveData() {
    let processedDate = new Date(this.dateInput.value);
    processedDate.setDate(processedDate.getDate()+1);

    await updateDoc(doc(this.db, 'lessons', this.lesson.id), {
      date: processedDate
    }).then(() => {
      alert('Data Alterada!');
    });

    this.dialogRef.close(true);
  }

  async deleteLesson(){
    const studentsFrequencies: any[] = JSON.parse(sessionStorage.getItem(this.lesson.id));
    
    //Local cleaning
    sessionStorage.removeItem(this.lesson.id);

    //Database cleaning
    studentsFrequencies.forEach(async (student) => {
      await deleteDoc(doc(this.db, 'frequencies', student.freqId));
    })
    await deleteDoc(doc(this.db, 'lessons', this.lesson.id));

    this.dialogRef.close(true);
  }

}
