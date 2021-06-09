import { TestBed } from '@angular/core/testing';

import { ReproJobService } from './repro-job.service';

describe('ReproJobService', () => {
  let service: ReproJobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReproJobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
