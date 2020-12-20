import { TestBed } from '@angular/core/testing';

import { PasutijumiResolverService } from './pasutijumi-resolver.service';

describe('PasutijumiResolverService', () => {
  let service: PasutijumiResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasutijumiResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
