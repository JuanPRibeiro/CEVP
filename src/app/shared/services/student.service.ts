import { Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { collection, getFirestore, query, getDocs, orderBy, where } from 'firebase/firestore'
import { groupBy } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private db = getFirestore();
  private students: DocumentData[];
  constructor() { }

  async getAllStudents(): Promise<DocumentData[]> {
    this.students = [];
    
    const q = query(
      collection(this.db, 'students'),
      orderBy('class'),
      orderBy('name')
    );

    return await getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.students.push({
          id: doc.id,
          authorization: doc.data()['authorization'],
          birthdate: new Date(doc.data()['birthdate'].toDate()),
          class: doc.data()['class'],
          contact: doc.data()['contact'],
          gender: doc.data()['gender'],
          name: doc.data()['name'],
          parent: doc.data()['parent'],
          parentContact: doc.data()['parentContact'],
          parentName: doc.data()['parentName'],
          schoolId: doc.data()['schoolId']
        });
      });
      return this.students;
    });
  }

  async getStudentsByClass(studentsClass: string): Promise<DocumentData[]> {
    this.students = [];

    const q = query(
      collection(this.db, 'students'),
      where('class', '==', studentsClass),
      orderBy('name')
    );

    return await getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.students.push({
          id: doc.id,
          authorization: doc.data()['authorization'],
          birthdate: new Date(doc.data()['birthdate'].toDate()),
          class: doc.data()['class'],
          contact: doc.data()['contact'],
          gender: doc.data()['gender'],
          name: doc.data()['name'],
          parent: doc.data()['parent'],
          parentContact: doc.data()['parentContact'],
          parentName: doc.data()['parentName'],
          schoolId: doc.data()['schoolId']
        });
      });
      return this.students;
    });
  }
}
