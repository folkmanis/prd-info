import { TestBed } from '@angular/core/testing';

import { InvoiceResolverService } from './invoice-resolver.service';

describe('InvoiceResolverService', () => {
  let service: InvoiceResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvoiceResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
