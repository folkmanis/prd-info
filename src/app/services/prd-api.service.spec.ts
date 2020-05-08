import { TestBed } from '@angular/core/testing';

import { PrdApiService } from './prd-api.service';

describe('PrdApiService', () => {
  let service: PrdApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrdApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
