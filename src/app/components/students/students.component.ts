import { Component, OnInit } from '@angular/core';
import { collection, getFirestore, query, getDocs } from 'firebase/firestore'
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { CreateStudentDLGComponent } from './dialogs/create-student-dlg/create-student-dlg.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  private db = getFirestore();
  protected students: any[];
  protected schools: any[];

  constructor(
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getStudents();
    this.getSchools();
  }

  async getStudents() {
    this.students = [];
    const q = query(collection(this.db, 'students'));

    await getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.students.push({
          id: doc.id,
          name: doc.data()['name'],
          birthdate: new Date(doc.data()['birthdate'].seconds * 1000),
          class: doc.data()['class'],
          schoolId: doc.data()['schoolId']
        });
      });
      const now = new Date();
      now.toISOString()
      this.showFilteredStudents()
    });
  }

  async getSchools(){
    this.schools = [];
    const q = query(collection(this.db, 'schools'));

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
    });
  }

  showFilteredStudents(){

  }

  openDialogCreateStudent(): void {
    const dialogRef = this.dialog.open(CreateStudentDLGComponent, {
      width: '65%',
      data: {
        schools: this.schools
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
