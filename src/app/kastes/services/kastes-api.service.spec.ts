import { TestBed } from '@angular/core/testing';

import { KastesApiService } from './kastes-api.service';

describe('KastesApiService', () => {
  let service: KastesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KastesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
