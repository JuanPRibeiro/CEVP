import { Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { collection, getFirestore, query, getDocs, orderBy, where } from 'firebase/firestore'

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
      orderBy('name')
    );

    return await getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.students.push({
          id: doc.id,
          name: doc.data()['name'],
          birthdate: new Date(doc.data()['birthdate'].seconds * 1000),
          class: doc.data()['class'],
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
          name: doc.data()['name'],
          birthdate: new Date(doc.data()['birthdate'].seconds * 1000),
          class: doc.data()['class'],
          schoolId: doc.data()['schoolId']
        });
      });
      return this.students;
    });
  }
}
