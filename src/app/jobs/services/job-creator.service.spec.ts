import { TestBed } from '@angular/core/testing';

import { JobCreatorService } from './job-creator.service';

describe('JobCreatorService', () => {
  let service: JobCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
