import { TestBed } from '@angular/core/testing';

import { JobEditFormService } from './job-edit-form.service';

describe('JobEditFormService', () => {
  let service: JobEditFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobEditFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
