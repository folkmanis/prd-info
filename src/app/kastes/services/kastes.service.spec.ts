import { TestBed } from '@angular/core/testing';

import { KastesService } from './kastes.service';

describe('KastesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KastesService = TestBed.get(KastesService);
    expect(service).toBeTruthy();
  });
});
