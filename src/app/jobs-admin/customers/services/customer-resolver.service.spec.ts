import { TestBed } from '@angular/core/testing';

import { CustomerResolverService } from './customer-resolver.service';

describe('CustomerResolverService', () => {
  let service: CustomerResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
