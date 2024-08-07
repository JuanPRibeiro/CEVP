import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateLessonDlgComponent } from './dialogs/create-lesson-dlg/create-lesson-dlg.component';
import { EditLessonDlgComponent } from './dialogs/edit-lesson-dlg/edit-lesson-dlg.component';
import { collection, doc, getDocs, getFirestore, orderBy, query, where, updateDoc, addDoc, getCountFromServer, and } from 'firebase/firestore';
import { StudentService } from 'src/app/shared/services/student.service';
import { DocumentData } from '@angular/fire/compat/firestore';
import * as DateFormat from 'src/app/shared/functions/dateFormat'
import { Router } from '@angular/router';

@Component({
  selector: 'app-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.css']
})
export class FrequencyComponent implements OnInit {
  private db = getFirestore();
  private changedFrequencies: number[] = [];
  protected type: string = 'lessons';
  protected lessons: DocumentData[] = [];
  protected selectedLesson: DocumentData;
  protected frequencies: DocumentData[] = [];
  protected students: DocumentData[] = [];
  protected nonLinkedStudents: DocumentData[] = [];
  protected df: any = DateFormat;
  protected avgFrequency: number = 0;
  protected studentsNum: number = 0;
  protected totalLessons: any = 0;
  protected totalAttendances: number = 0;
  protected totalAttendancesClass: any = 0;

  constructor(
    private dialog: MatDialog,
    private studentService: StudentService,
    private router: Router,
  ) { }

  async ngOnInit() {
    const sidebarCheck = document.querySelector("#check") as HTMLInputElement;
    let screenWidth = window.innerWidth;

    if (screenWidth >= 800) sidebarCheck.checked = true;

    const lessonsLabel = document.querySelector('.label-tLessons') as HTMLLabelElement;
    lessonsLabel.style.backgroundColor = "#3dc20070";

    this.students = await this.studentService.getStudentsByClass('Manhã');

    await this.getLessons().then(async () => {
      if (this.selectedLesson !== undefined) {
        await this.getStudentsFrequency(this.selectedLesson.id);
      } else {
        this.frequencies = [];
      }
    });

    setTimeout(async () => {
      this.studentsNum = await this.studentService.getStudentsNum();
      this.totalLessons = await this.getTotalLessons();
      this.totalAttendances = await this.getTotalAttendances();
      this.totalAttendancesClass = await this.getTotalAttendancesClass();
    }, 500);
    this.getAverageFrequency();
  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.lessons.forEach(lesson => {
      sessionStorage.removeItem(lesson.id)
    })
  }

  async getLessons(): Promise<void> {
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

    setTimeout(() => {
      const lessons = document.querySelector('.lessons') as HTMLDivElement;
      lessons.scrollTo({
        left: lessons.scrollWidth, 
        behavior: 'smooth'
      });
    }, 250);
  }

  async getStudentsFrequency(lessonId: string): Promise<void> {
    this.frequencies = [];
    this.changedFrequencies = [];

    if (lessonId === undefined) return;

    if (sessionStorage.getItem(lessonId) == null) {
      const q = query(
        collection(this.db, 'frequencies'),
        where('lessonId', '==', lessonId),
        orderBy('studentName')
      );

      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.frequencies.push({
            freqId: doc.id,
            attendance: doc.data()['attendance'],
            studentId: doc.data()['studentId'],
            name: doc.data()['studentName']
          })
        })

        sessionStorage.setItem(lessonId, JSON.stringify(this.frequencies))
      })
    } else {
      this.frequencies = JSON.parse(sessionStorage.getItem(lessonId));
    }

    this.nonLinkedStudents = this.students.filter(student =>
      this.frequencies.find(linkedStudent => linkedStudent.studentId == student.id) === undefined
    );
  }

  openDialogCreateLesson(): void {
    const dialogRef = this.dialog.open(CreateLessonDlgComponent, {
      width: '65%',
    });

    dialogRef.afterClosed().subscribe(reload => {
      if (reload) window.location.reload();
    });
  }

  openDialogEditLesson(lesson: any): void {
    const dialogRef = this.dialog.open(EditLessonDlgComponent, {
      width: '65%',
      data: {
        lesson: lesson
      }
    });

    dialogRef.afterClosed().subscribe(reload => {
      if (reload) window.location.reload();
    });
  }

  async changeClass(): Promise<void> {
    const studentsClass = document.querySelector('#class') as HTMLSelectElement;

    this.students = await this.studentService.getStudentsByClass(studentsClass.value);
    await this.getLessons().then(async () => {
      if (this.selectedLesson !== undefined) {
        await this.getStudentsFrequency(this.selectedLesson.id);
      } else {
        this.frequencies = [];
      }
    });

    this.getAverageFrequency();
  }

  changeDate(lessonIndex: number): void {
    if (this.selectedLesson == this.lessons[lessonIndex]) {
      //Abrir dialog de edição da aula (mudar data ou excluir)
      this.openDialogEditLesson(this.selectedLesson);
    } else {
      //Buscar alunos da turma selecionada
      this.selectedLesson = this.lessons[lessonIndex];
      this.getStudentsFrequency(this.selectedLesson.id);
    }
  }

  changeAttendance(freqIndex: number): void {
    this.frequencies[freqIndex].attendance = !this.frequencies[freqIndex].attendance;

    //Salvando os estudantes alterados p/ alterar no banco apenas os necessários
    if (this.changedFrequencies.find((index) => index == freqIndex) === undefined) {
      this.changedFrequencies.push(freqIndex);
    } else {
      this.changedFrequencies.splice(freqIndex, 1);
    }

    sessionStorage.setItem(this.selectedLesson.id, JSON.stringify(this.frequencies));
  }

  async linkStudent(): Promise<void> {
    const select = document.querySelector("#addStudent") as HTMLSelectElement;

    await addDoc(collection(this.db, 'frequencies'), {
      lessonId: this.selectedLesson.id,
      studentId: select.options[select.selectedIndex].value,
      studentName: select.options[select.selectedIndex].text,
      attendance: true
    }).then((newDoc) => {
      this.frequencies.push({
        freqId: newDoc.id,
        attendance: true,
        studentId: select.options[select.selectedIndex].value,
        name: select.options[select.selectedIndex].text
      })
      this.nonLinkedStudents = this.nonLinkedStudents.filter(item => item.id != select.options[select.selectedIndex].value);

      select.options.remove(select.selectedIndex);
    })
  }

  saveFrequency(): void {
    this.changedFrequencies.forEach((index) => {
      updateDoc(doc(this.db, 'frequencies', this.frequencies[index].freqId), {
        attendance: this.frequencies[index].attendance
      });
    })
    alert('Lista Salva!');
  }

  changeType(): void {
    const input = document.getElementsByName('type') as NodeListOf<HTMLInputElement>;
    let checkedLabel: HTMLLabelElement;
    let uncheckedLabel: HTMLLabelElement;

    if (input[0].checked) {
      this.type = 'lessons';
      checkedLabel = document.querySelector('.label-tLessons');
      uncheckedLabel = document.querySelector('.label-tStudents');
    } else {
      this.type = 'students';
      checkedLabel = document.querySelector('.label-tStudents');
      uncheckedLabel = document.querySelector('.label-tLessons');
    }

    checkedLabel.style.backgroundColor = "#3dc20070";
    uncheckedLabel.style.backgroundColor = "#c2af0070";
  }

  redirectToStudentData(student: Object): void {
    sessionStorage.setItem('student', JSON.stringify(student));
    this.router.navigate(['header/students/student']);
  }

  async getTotalAttendances(): Promise<number> {
    const q = query(collection(this.db, 'frequencies'),
  where('attendance','==', true));

    return (await getCountFromServer(q)).data().count;
  }

  async getTotalAttendancesClass(): Promise<any> {
    const data = {
      afternoon: 0,
      morning: 0
    }

    const afternoonQuery = query(
      collection(this.db, 'frequencies'),
      where('class', '==', 'Tarde')
    );
    const morningQuery = query(
      collection(this.db, 'frequencies'),
      where('class', '==', 'Manhã')
    );

    data.afternoon = (await getCountFromServer(afternoonQuery)).data().count;
    data.morning = (await getCountFromServer(morningQuery)).data().count;

    return data;
  }


  async getTotalLessons(): Promise<any> {
    const data = {
      afternoon: 0,
      morning: 0
    }

    const afternoonQuery = query(
      collection(this.db, 'lessons'),
      where('class', '==', 'Tarde')
    );
    const morningQuery = query(
      collection(this.db, 'lessons'),
      where('class', '==', 'Manhã')
    );

    data.afternoon = (await getCountFromServer(afternoonQuery)).data().count;
    data.morning = (await getCountFromServer(morningQuery)).data().count;

    return data;
  }

  getAverageFrequency(): void {
    this.avgFrequency = 0;

    this.students.forEach(student => {
      this.avgFrequency += student.attendance.percentage;
    })

    this.avgFrequency /= this.students.length;
  }
}
