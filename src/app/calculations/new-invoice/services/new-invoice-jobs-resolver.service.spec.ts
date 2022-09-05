import { TestBed } from '@angular/core/testing';

import { NewInvoiceJobsResolverService } from './new-invoice-jobs-resolver.service';

describe('NewInvoiceJobsResolverService', () => {
  let service: NewInvoiceJobsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewInvoiceJobsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
