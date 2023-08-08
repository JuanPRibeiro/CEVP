import { Component, OnInit } from '@angular/core';
import { collection, getFirestore, query, getDocs, orderBy } from 'firebase/firestore'
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateStudentDLGComponent } from './dialogs/create-student-dlg/create-student-dlg.component';
import { StudentService } from 'src/app/shared/services/student.service';

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
    private dialog: MatDialog,
    private studentService: StudentService
  ) { }

  ngOnInit(): void {
    this.getStudents();
    this.getSchools();
  }

  async getStudents() {
    this.students = await this.studentService.getAllStudents();

    const now = new Date();
    now.toISOString()
    this.showFilteredStudents()
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
    });
  }

  showFilteredStudents() {

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
