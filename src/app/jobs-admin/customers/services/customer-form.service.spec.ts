import { TestBed } from '@angular/core/testing';

import { CustomerFormService } from './customer-form.service';

describe('CustomerFormService', () => {
  let service: CustomerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
