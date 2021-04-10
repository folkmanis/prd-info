import { TestBed } from '@angular/core/testing';

import { JobPricesService } from './job-prices.service';

describe('JobPricesService', () => {
  let service: JobPricesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobPricesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
