import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsernewComponent } from './usernew.component';

describe('UsernewComponent', () => {
  let component: UsernewComponent;
  let fixture: ComponentFixture<UsernewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsernewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsernewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
