import { TestBed } from '@angular/core/testing';

import { JobEditDialogService } from './job-edit-dialog.service';

describe('JobEditDialogService', () => {
  let service: JobEditDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobEditDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
