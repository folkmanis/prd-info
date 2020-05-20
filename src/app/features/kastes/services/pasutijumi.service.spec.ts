import { TestBed } from '@angular/core/testing';

import { PasutijumiService } from './pasutijumi.service';

describe('PasutijumiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PasutijumiService = TestBed.inject(PasutijumiService);
    expect(service).toBeTruthy();
  });
});
