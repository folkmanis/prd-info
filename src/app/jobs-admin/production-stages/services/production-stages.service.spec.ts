import { TestBed } from '@angular/core/testing';

import { ProductionStagesService } from './production-stages.service';

describe('ProductionStagesService', () => {
  let service: ProductionStagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionStagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
