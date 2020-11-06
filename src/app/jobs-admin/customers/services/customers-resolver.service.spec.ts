import { TestBed } from '@angular/core/testing';

import { CustomersResolverService } from './customers-resolver.service';

describe('CustomersResolverService', () => {
  let service: CustomersResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomersResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
