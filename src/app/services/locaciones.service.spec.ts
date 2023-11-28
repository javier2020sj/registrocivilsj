import { TestBed } from '@angular/core/testing';

import { LocacionesService } from './locaciones.service';

describe('LocacionesService', () => {
  let service: LocacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
