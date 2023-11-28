import { TestBed } from '@angular/core/testing';

import { GlobalesService } from './globales.service';

describe('GlobalesService', () => {
  let service: GlobalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
