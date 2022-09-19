import { TestBed } from '@angular/core/testing';

import { KastesLocalStorageService } from './kastes-local-storage.service';

describe('KastesLocalStorageService', () => {
  let service: KastesLocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KastesLocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
