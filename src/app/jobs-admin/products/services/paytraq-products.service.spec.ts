import { TestBed } from '@angular/core/testing';

import { PaytraqProductsService } from './paytraq-products.service';

describe('PaytraqProductsService', () => {
  let service: PaytraqProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaytraqProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
