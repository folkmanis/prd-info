import { TestBed } from '@angular/core/testing';

import { PaytraqClientService } from './paytraq-client.service';

describe('PaytraqClientService', () => {
  let service: PaytraqClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaytraqClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
