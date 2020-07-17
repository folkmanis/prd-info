import { TestBed } from '@angular/core/testing';

import { ProductsEditService } from './products-edit.service';

describe('ProductsEditService', () => {
  let service: ProductsEditService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsEditService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
