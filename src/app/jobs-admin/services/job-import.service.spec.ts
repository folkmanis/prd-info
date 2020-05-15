import { TestBed } from '@angular/core/testing';

import { JobImportService } from './job-import.service';

describe('JobImportService', () => {
  let service: JobImportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
