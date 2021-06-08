import { TestBed } from '@angular/core/testing';

import { ReproJobDialogService } from './repro-job-dialog.service';

describe('ReproJobDialogService', () => {
  let service: ReproJobDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReproJobDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
