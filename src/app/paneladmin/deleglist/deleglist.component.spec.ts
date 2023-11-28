import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleglistComponent } from './deleglist.component';

describe('DeleglistComponent', () => {
  let component: DeleglistComponent;
  let fixture: ComponentFixture<DeleglistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleglistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
