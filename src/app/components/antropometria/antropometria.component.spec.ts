import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AntropometriaComponent } from './antropometria.component';

describe('AntropometriaComponent', () => {
  let component: AntropometriaComponent;
  let fixture: ComponentFixture<AntropometriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AntropometriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AntropometriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
