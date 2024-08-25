import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DocumentData, collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { StudentService } from 'src/app/shared/services/student.service';
import * as DateFormat from 'src/app/shared/functions/dateFormat';

@Component({
  selector: 'app-antropometria',
  templateUrl: './antropometria.component.html',
  styleUrls: ['./antropometria.component.css']
})
export class AntropometriaComponent implements OnInit {
  private db = getFirestore();
  protected now: Date = new Date();
  protected students: any[];
  protected schools: any[];
  protected df: any = DateFormat;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.getStudents();
    this.getSchools();

    const sidebarCheck = document.querySelector("#check") as HTMLInputElement;
    let screenWidth = window.innerWidth;

    if(screenWidth >= 800) sidebarCheck.checked = true;
  }

  async getStudents() {
    const activated = document.querySelector('#activated') as HTMLSelectElement;

    this.students = activated.value == "true" ? await this.studentService.getAllStudents() : await this.studentService.getAllStudents(false);
 }

  async getSchools() {
    this.schools = [];
    const q = query(
      collection(this.db, 'schools'),
      orderBy('name')  
    );

    await getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.schools.push({
          id: doc.id,
          name: doc.data()['name'],
          address: doc.data()['address'],
          city: doc.data()['city'],
          state: doc.data()['state'],
          cep: doc.data()['cep'],
          contact: doc.data()['contact']
        });
      });

      sessionStorage.setItem('schools', JSON.stringify(this.schools));
    });
  }

  redirectToStudentData(student: Object) {
    sessionStorage.setItem('student', JSON.stringify(student));
    this.router.navigate(['header/antropometria/studentA']);
  }

  async getAllStudents(activated: boolean = true): Promise<DocumentData[]> {
    this.students = [];

    const q = query(
      collection(this.db, 'antropometrias'),
      where('activated', "==", activated),
      orderBy('class'),
      orderBy('name')
    );

    return await getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.students.push({
          id: doc.id,
          activated: doc.data()['activated'],
          avaliation: doc.data()['avaliation1'].toDate(),
          class: doc.data()['class'],
          gender: doc.data()['gender'],
          name: doc.data()['name'],
          weight: doc.data()['weight'],
          estatura: doc.data()['estatura'],
          envergadura: doc.data()['envergadura'],
          saltoH: doc.data()['saltoH'],
          corrida: doc.data()['corrida'],
          quadrado4x4: doc.data()['quadrado4x4'],
          arremesso: doc.data()['arremesso'],
          caminhada: doc.data()['caminhada'],
          alcanceE: doc.data()['alcanceE'],
          alcanceA: doc.data()['alcanceA']
        });
      });
      return this.students;
    });
  
  
}
  getStudentModule(arg0: any) {
    throw new Error('Method not implemented.');
  }

}
