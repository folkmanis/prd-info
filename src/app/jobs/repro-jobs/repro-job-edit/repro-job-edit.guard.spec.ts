import { TestBed } from '@angular/core/testing';

import { ReproJobEditGuard } from './repro-job-edit.guard';

describe('ReproJobEditGuard', () => {
  let guard: ReproJobEditGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ReproJobEditGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
