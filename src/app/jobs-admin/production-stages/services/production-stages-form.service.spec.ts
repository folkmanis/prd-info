import { TestBed } from '@angular/core/testing';

import { ProductionStagesFormService } from './production-stages-form.service';

describe('ProductionStagesFormService', () => {
  let service: ProductionStagesFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductionStagesFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
