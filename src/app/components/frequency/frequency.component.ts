import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateLessonDlgComponent } from './dialogs/create-lesson-dlg/create-lesson-dlg.component';
import { collection, getDoc, doc, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { StudentService } from 'src/app/shared/services/student.service';
import { DocumentData } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.css']
})
export class FrequencyComponent implements OnInit {
  private db = getFirestore();
  protected lessons: DocumentData[] = [];
  protected selectedLesson:DocumentData;
  protected students: DocumentData[] = [];

  constructor(
    private dialog: MatDialog,
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.getLessons().then(() => {
      this.getStudentsFrequency(this.selectedLesson);
    });
  }

  async getLessons(){
    const q = query(
      collection(this.db, 'lessons'),
      orderBy('date')
    );

    await getDocs(q).then(async (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.lessons.push({
          id: doc.id,
          date: doc.data()['date'].toDate(),
          class: doc.data()['class']
        });
      })

      this.selectedLesson = this.lessons[this.lessons.length-1];
    })
  }

  async getStudentsFrequency(lesson: DocumentData) {
    const q = query(
      collection(this.db, 'frequencies'),
      where('lessonId', '==', lesson.id),
      orderBy('studentName')
    );

    await getDocs(q).then((querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        this.students.push({
          freqId: doc.id,
          name: doc.data()['studentName'],
          attendance: doc.data()['attendance']
        })
      })
    })
  }

  openDialogCreateLesson(): void {
    const dialogRef = this.dialog.open(CreateLessonDlgComponent, {
      width: '65%',
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

  selectDate() {
    
  }
}
