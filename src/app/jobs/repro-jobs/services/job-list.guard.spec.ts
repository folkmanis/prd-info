import { TestBed } from '@angular/core/testing';

import { JobListGuard } from './job-list.guard';

describe('JobListGuard', () => {
  let guard: JobListGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(JobListGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
