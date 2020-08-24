import { TestBed } from '@angular/core/testing';

import { VersionInterceptorService } from './version-interceptor.service';

describe('VersionInterceptorService', () => {
  let service: VersionInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VersionInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
