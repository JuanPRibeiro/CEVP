import { Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/compat/firestore';
import { collection, getFirestore, query, getDocs, orderBy, where, getCountFromServer } from 'firebase/firestore';
@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private db = getFirestore();
  private students: DocumentData[];
  constructor() { }

  async getAllStudents(activated: boolean = true): Promise<DocumentData[]> {
    this.students = [];

    const q = query(
      collection(this.db, 'students'),
      where('activated', "==", activated),
      orderBy('class'),
      orderBy('name')
    );

    return await getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        this.students.push({
          id: doc.id,
          activated: doc.data()['activated'],
          age: this.getStudentAge(doc.data()['birthdate'].toDate()),
          authorization: doc.data()['authorization'],
          birthdate: new Date(doc.data()['birthdate'].toDate()),
          class: doc.data()['class'],
          contact: doc.data()['contact'],
          deactivationReason: doc.data()['deactivationReason'],
          gender: doc.data()['gender'],
          module: this.getStudentModule(doc.data()['birthdate'].toDate()),
          name: doc.data()['name'],
          parent: doc.data()['parent'],
          parentContact: doc.data()['parentContact'],
          parentName: doc.data()['parentName'],
          responsibleTCLE: doc.data()['responsibleTCLE'],
          schoolId: doc.data()['schoolId'],
          studentTCLE: doc.data()['studentTCLE'],
          tale: doc.data()['tale']
        });
      });
      return this.students;
    });
  }

  async getStudentsByClass(studentsClass: string, activated: boolean = true): Promise<DocumentData[]> {
    this.students = [];

    const q = query(
      collection(this.db, 'students'),
      where('class', '==', studentsClass),
      where('activated', "==", activated),
      orderBy('name')
    );

    return await getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(async doc => {
        this.students.push({
          id: doc.id,
          authorization: doc.data()['authorization'],
          activated: doc.data()['activated'],
          attendance: (await this.getStudentFrequency(doc.id)),
          birthdate: new Date(doc.data()['birthdate'].toDate()),
          class: doc.data()['class'],
          contact: doc.data()['contact'],
          deactivationReason: doc.data()['deactivationReason'],
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

  getStudentAge(birthdate: number | Date): number {
    birthdate = new Date(birthdate);

    const now = new Date();
    let age = now.getFullYear() - birthdate.getFullYear();

    if (
      now.getMonth() < birthdate.getMonth() ||
      (now.getMonth() == birthdate.getMonth() && now.getDate() < birthdate.getDate())
    ) {
      age--;
    }
    return age;
  }

  getStudentModule(birthdate: number): number {
    const now = new Date();
    const birthdateYear = new Date(birthdate).getFullYear();
    const m2Year = now.getFullYear() - 17;
    const m1Year = now.getFullYear() - 14;
    const m0Year = now.getFullYear() - 11;

    let module = 3;
    if (birthdateYear >= m2Year) {
      module--;
      if (birthdateYear >= m1Year) {
        module--;
        if (birthdateYear >= m0Year) {
          module--;
        }
      }
    }
    return module;
  }

  /**
   * @param studentId 
   * @returns obj = {
   *  attendances: number,
   *  lessons: number,
   *  percentage: number
   * }
   */
  async getStudentFrequency(studentId: string): Promise<any> {
    let attendances = 0;
    let lessons = 0;

    const q = query(
      collection(this.db, 'frequencies'),
      where('studentId', "==", studentId),
    );

    return await getDocs(q).then(querySnapshot => {
      querySnapshot.forEach(doc => {
        lessons++;
        if (doc.data()['attendance'] == true) attendances++;
      })
    }).then(() => {
      const data = {
        attendances: attendances,
        lessons: lessons,
        percentage: parseFloat((attendances / lessons * 100).toFixed(2))
      }

      return data;
    })
  }

  async getStudentsNum(): Promise<number> {
    const q = query(collection(this.db, 'students'));

    return ((await getCountFromServer(q)).data().count)
  }
}
