import { TestBed } from '@angular/core/testing';

import { JobPricesResolverService } from './job-prices-resolver.service';

describe('JobPricesResolverService', () => {
  let service: JobPricesResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobPricesResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
