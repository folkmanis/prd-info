import { TestBed } from '@angular/core/testing';

import { JobsFilesApiService } from './jobs-files-api.service';

describe('JobsFilesApiService', () => {
  let service: JobsFilesApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobsFilesApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
