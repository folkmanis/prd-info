import { TestBed } from '@angular/core/testing';

import { ReproJobResolverService } from './repro-job-resolver.service';

describe('ReproJobResolverService', () => {
  let service: ReproJobResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReproJobResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
