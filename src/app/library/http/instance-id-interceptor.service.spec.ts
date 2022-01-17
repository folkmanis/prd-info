import { TestBed } from '@angular/core/testing';

import { InstanceIdInterceptorService } from './instance-id-interceptor.service';

describe('InstanceIdInterceptorService', () => {
  let service: InstanceIdInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstanceIdInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
