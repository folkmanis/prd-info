import { TestBed } from '@angular/core/testing';

import { CustomersEffectsService } from './customers-effects.service';

describe('CustomersEffectsService', () => {
  let service: CustomersEffectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomersEffectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
