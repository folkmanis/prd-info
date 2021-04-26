import { TestBed } from '@angular/core/testing';

import { JobFormService } from './job-form.service';

describe('JobFormService', () => {
  let service: JobFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
