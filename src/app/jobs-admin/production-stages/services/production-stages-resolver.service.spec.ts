import { TestBed } from '@angular/core/testing';

import { ProductionStagesResolverService } from './production-stages-resolver.service';

describe('ProductionStagesResolverService', () => {
  let service: ProductionStagesResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionStagesResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
