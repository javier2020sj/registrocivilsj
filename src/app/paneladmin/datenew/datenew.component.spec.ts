import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatenewComponent } from './datenew.component';

describe('DatenewComponent', () => {
  let component: DatenewComponent;
  let fixture: ComponentFixture<DatenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatenewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
