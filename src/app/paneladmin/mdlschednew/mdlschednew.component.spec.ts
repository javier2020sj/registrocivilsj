import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlschednewComponent } from './mdlschednew.component';

describe('MdlschednewComponent', () => {
  let component: MdlschednewComponent;
  let fixture: ComponentFixture<MdlschednewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MdlschednewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MdlschednewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
