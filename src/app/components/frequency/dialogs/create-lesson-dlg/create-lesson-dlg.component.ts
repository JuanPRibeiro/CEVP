import { Component, Inject, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DocumentReference, addDoc, collection, getFirestore } from 'firebase/firestore';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-create-lesson-dlg',
  templateUrl: './create-lesson-dlg.component.html',
  styleUrls: ['./create-lesson-dlg.component.css']
})
export class CreateLessonDlgComponent implements OnInit {
  private db = getFirestore();
  private students: DocumentData[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: { },
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateLessonDlgComponent>,
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  async createLesson() {
    const date = document.querySelector('#date') as HTMLInputElement;
    let studentsClass = document.querySelector('#newClass') as HTMLSelectElement;

    let processedDate = new Date(date.value);

    processedDate.setDate(processedDate.getDate()+1);

    await addDoc(collection(this.db, "lessons"), {
      date: processedDate,
      class: studentsClass.value,
    }).then(async (lesson) => {
      this.linkStudents(lesson, studentsClass.value);
    })
  }

  linkStudents(lesson: DocumentReference<DocumentData>, studentsClass: string) {
    this.studentService.getStudentsByClass(studentsClass).then((students) => {
      students.forEach((student) => {
        addDoc(collection(this.db, 'frequencies'), {
          lessonId: lesson.id,
          studentId: student.id,
          studentName: student.name,
          attendance: true
        })
      })
    }).then(() => {
      setTimeout(() => {
        alert('Aula cadastrada!');
        this.dialogRef.close();
      }, 2000);
    });
  }
}
