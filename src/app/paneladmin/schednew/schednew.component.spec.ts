import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchednewComponent } from './schednew.component';

describe('SchednewComponent', () => {
  let component: SchednewComponent;
  let fixture: ComponentFixture<SchednewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchednewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchednewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
