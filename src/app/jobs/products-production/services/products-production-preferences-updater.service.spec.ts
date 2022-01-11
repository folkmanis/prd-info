import { TestBed } from '@angular/core/testing';

import { ProductsProductionPreferencesUpdaterService } from './products-production-preferences-updater.service';

describe('ProductsProductionPreferencesUpdaterService', () => {
  let service: ProductsProductionPreferencesUpdaterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsProductionPreferencesUpdaterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
