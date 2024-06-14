import { ComponentFixture, TestBed } from '@angular/core/testing';

import { studentAComponent } from './studentA.component';

describe('StudentComponent', () => {
  let component: studentAComponent;
  let fixture: ComponentFixture<studentAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ studentAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(studentAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
