import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateLessonDlgComponent } from './dialogs/create-lesson-dlg/create-lesson-dlg.component';
import { collection, getDoc, doc, getDocs, getFirestore, orderBy, query, where, updateDoc } from 'firebase/firestore';
import { StudentService } from 'src/app/shared/services/student.service';
import { DocumentData } from '@angular/fire/compat/firestore';
import { findIndex } from 'rxjs';

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
  private changedStudents: number[] = [];

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
    this.lessons = [];

    const studentsClass = document.querySelector('#class') as HTMLSelectElement;

    const q = query(
      collection(this.db, 'lessons'),
      where('class', '==', studentsClass.value),
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
    this.students = [];
    this.changedStudents = [];

    if(lesson === undefined) return;
    
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

  changeClass() {
    this.getLessons().then(() => {
      this.getStudentsFrequency(this.selectedLesson);
    });
  }

  changeDate(lessonIndex: number) {
    this.selectedLesson = this.lessons[lessonIndex];

    this.getStudentsFrequency(this.selectedLesson);
  }

  changeAttendance(studentIndex: number) {
    this.students[studentIndex].attendance = !this.students[studentIndex].attendance;

    //Salvando os estudantes alterados p/ alterar no banco apenas os necessários
    if(this.changedStudents.find((index) => index == studentIndex) === undefined){
      this.changedStudents.push(studentIndex);
    } else {
      this.changedStudents.splice(studentIndex, 1);
    }
  }

  saveFrequency(){
    this.changedStudents.forEach((index) => {
      updateDoc(doc(this.db, 'frequencies', this.students[index].freqId), {
        attendance: this.students[index].attendance
      });
    })
    alert('Lista Salva!');
  }
}
