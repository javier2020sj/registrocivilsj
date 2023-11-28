import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedlistComponent } from './schedlist.component';

describe('SchedlistComponent', () => {
  let component: SchedlistComponent;
  let fixture: ComponentFixture<SchedlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
