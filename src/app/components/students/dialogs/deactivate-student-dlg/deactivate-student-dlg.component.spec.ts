import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeactivateStudentDlgComponent } from './deactivate-student-dlg.component';

describe('DeactivateStudentDlgComponent', () => {
  let component: DeactivateStudentDlgComponent;
  let fixture: ComponentFixture<DeactivateStudentDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeactivateStudentDlgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeactivateStudentDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
