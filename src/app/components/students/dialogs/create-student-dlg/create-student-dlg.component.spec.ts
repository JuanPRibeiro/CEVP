import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStudentDLGComponent } from './create-student-dlg.component';

describe('CreateStudentDLGComponent', () => {
  let component: CreateStudentDLGComponent;
  let fixture: ComponentFixture<CreateStudentDLGComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateStudentDLGComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStudentDLGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
