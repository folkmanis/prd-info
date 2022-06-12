import { TestBed } from '@angular/core/testing';

import { JobFilesService } from './job-files.service';

describe('JobFilesService', () => {
  let service: JobFilesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobFilesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
