import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLessonDlgComponent } from './create-lesson-dlg.component';

describe('CreateLessonDlgComponent', () => {
  let component: CreateLessonDlgComponent;
  let fixture: ComponentFixture<CreateLessonDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLessonDlgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLessonDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
