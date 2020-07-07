import { TestBed } from '@angular/core/testing';

import { KastesTabulaService } from './kastes-tabula.service';

describe('KastesTabulaService', () => {
  let service: KastesTabulaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KastesTabulaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
