import { TestBed } from '@angular/core/testing';

import { KastesJobResolverService } from './kastes-job-resolver.service';

describe('KastesJobResolverService', () => {
  let service: KastesJobResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KastesJobResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
