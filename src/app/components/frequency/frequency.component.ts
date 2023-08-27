import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateLessonDlgComponent } from './dialogs/create-lesson-dlg/create-lesson-dlg.component';
import { collection, doc, getDocs, getFirestore, orderBy, query, where, updateDoc, addDoc, getDoc } from 'firebase/firestore';
import { StudentService } from 'src/app/shared/services/student.service';
import { DocumentData } from '@angular/fire/compat/firestore';
import * as DateFormat from 'src/app/shared/functions/dateFormat'

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.css']
})
export class FrequencyComponent implements OnInit {
  private db = getFirestore();
  private changedStudents: number[] = [];
  protected lessons: DocumentData[] = [];
  protected selectedLesson: DocumentData;
  protected students: DocumentData[] = [];
  protected studentsClass: DocumentData[] = [];
  protected nonLinkedStudents: DocumentData[] = [];
  protected df: any = DateFormat;

  constructor(
    private dialog: MatDialog,
    private studentService: StudentService
  ) { }

  async ngOnInit() {
    this.studentsClass = await this.studentService.getStudentsByClass('Manhã');
    this.getLessons().then(() => {
      this.getStudentsFrequency(this.selectedLesson.id);
    });
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.lessons.forEach(lesson => {
      sessionStorage.removeItem(lesson.id)
    })
  }

  async getLessons() {
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

      this.selectedLesson = this.lessons[this.lessons.length - 1];
    })
  }

  async getStudentsFrequency(lessonId: string) {
    this.students = [];
    this.changedStudents = [];

    if (lessonId === undefined) return;

    if (sessionStorage.getItem(lessonId) == null) {
      const q = query(
        collection(this.db, 'frequencies'),
        where('lessonId', '==', lessonId),
        orderBy('studentName')
      );

      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.students.push({
            freqId: doc.id,
            attendance: doc.data()['attendance'],
            studentId: doc.data()['studentId'],
            name: doc.data()['studentName']
          })
        })

        sessionStorage.setItem(lessonId, JSON.stringify(this.students))
      })
    } else {
      this.students = JSON.parse(sessionStorage.getItem(lessonId));
    }

    this.nonLinkedStudents = this.studentsClass.filter(student =>
      this.students.find(linkedStudent => linkedStudent.studentId == student.id) === undefined
    );
  }

  openDialogCreateLesson(): void {
    const dialogRef = this.dialog.open(CreateLessonDlgComponent, {
      width: '65%',
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
    });
  }

  async changeClass() {
    const studentsClass = document.querySelector('#class') as HTMLSelectElement;

    this.studentsClass = await this.studentService.getStudentsByClass(studentsClass.value);
    this.getLessons().then(() => {
      this.getStudentsFrequency(this.selectedLesson.id);
    });
  }

  changeDate(lessonIndex: number) {
    this.selectedLesson = this.lessons[lessonIndex];

    this.getStudentsFrequency(this.selectedLesson.id);
  }

  changeAttendance(studentIndex: number) {
    this.students[studentIndex].attendance = !this.students[studentIndex].attendance;
    
    //Salvando os estudantes alterados p/ alterar no banco apenas os necessários
    if (this.changedStudents.find((index) => index == studentIndex) === undefined) {
      this.changedStudents.push(studentIndex);
    } else {
      this.changedStudents.splice(studentIndex, 1);
    }
    
    sessionStorage.setItem(this.selectedLesson.id, JSON.stringify(this.students));
  }

  async linkStudent() {
    const select = document.querySelector("#addStudent") as HTMLSelectElement;

    await addDoc(collection(this.db, 'frequencies'), {
      lessonId: this.selectedLesson.id,
      studentId: select.options[select.selectedIndex].value,
      studentName: select.options[select.selectedIndex].text,
      attendance: true
    }).then((newDoc) => {
      this.students.push({
        freqId: newDoc.id,
        attendance: true,
        studentId: select.options[select.selectedIndex].value,
        name: select.options[select.selectedIndex].text
      })
      this.nonLinkedStudents = this.nonLinkedStudents.filter(item => item.id != select.options[select.selectedIndex].value);
      
      select.options.remove(select.selectedIndex);
    })
  }

  saveFrequency() {
    this.changedStudents.forEach((index) => {
      updateDoc(doc(this.db, 'frequencies', this.students[index].freqId), {
        attendance: this.students[index].attendance
      });
    })
    alert('Lista Salva!');
  }
}
