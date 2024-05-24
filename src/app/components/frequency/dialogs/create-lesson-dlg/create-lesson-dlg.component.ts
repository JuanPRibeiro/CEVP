import { Component, Inject, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DocumentReference, addDoc, collection, getFirestore } from 'firebase/firestore';
import { StudentService } from 'src/app/shared/services/student.service';

@Component({
  selector: 'app-create-lesson-dlg',
  templateUrl: './create-lesson-dlg.component.html',
  styleUrls: ['./create-lesson-dlg.component.css']
})
export class CreateLessonDlgComponent implements OnInit {
  private db = getFirestore();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {},
    private dialogRef: MatDialogRef<CreateLessonDlgComponent>,
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  async createLesson() {
    const date = document.querySelector('#date') as HTMLInputElement;
    let studentsClass = document.querySelector('#newClass') as HTMLSelectElement;

    let processedDate = new Date(date.value);

    processedDate.setDate(processedDate.getDate() + 1);

    await addDoc(collection(this.db, "lessons"), {
      date: processedDate,
      class: studentsClass.value,
    }).then(async (lesson) => {
      await this.linkStudents(lesson, studentsClass.value);
    })
  }

  async linkStudents(lesson: DocumentReference<DocumentData>, studentsClass: string) {
    const students = await this.studentService.getStudentsByClass(studentsClass);

    const addFrequenciesPromises = students.map(async (student) => {
      await addDoc(collection(this.db, 'frequencies'), {
        lessonId: lesson.id,
        studentId: student.id,
        studentName: student.name,
        attendance: false
      });
    });
  
    await Promise.all(addFrequenciesPromises);
  
    alert('Aula cadastrada!');
    this.dialogRef.close(true);
  }
}
