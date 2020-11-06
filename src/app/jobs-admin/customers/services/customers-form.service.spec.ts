import { TestBed } from '@angular/core/testing';

import { CustomersFormService } from './customers-form.service';

describe('CustomersFormService', () => {
  let service: CustomersFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomersFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
