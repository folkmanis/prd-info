import { TestBed } from '@angular/core/testing';

import { PasutijumsResolverService } from './pasutijums-resolver.service';

describe('PasutijumsResolverService', () => {
  let service: PasutijumsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasutijumsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
