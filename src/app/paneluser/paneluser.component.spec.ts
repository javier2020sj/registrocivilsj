import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaneluserComponent } from './paneluser.component';

describe('PaneluserComponent', () => {
  let component: PaneluserComponent;
  let fixture: ComponentFixture<PaneluserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaneluserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaneluserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
