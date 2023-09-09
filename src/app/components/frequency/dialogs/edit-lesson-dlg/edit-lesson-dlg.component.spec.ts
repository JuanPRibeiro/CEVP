import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLessonDlgComponent } from './edit-lesson-dlg.component';

describe('EditLessonDlgComponent', () => {
  let component: EditLessonDlgComponent;
  let fixture: ComponentFixture<EditLessonDlgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLessonDlgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLessonDlgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
