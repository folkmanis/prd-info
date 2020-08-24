import { TestBed } from '@angular/core/testing';

import { ApiVersionService } from './api-version.service';

describe('ApiVersionService', () => {
  let service: ApiVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
