import { TestBed } from '@angular/core/testing';

import { JobsUserPreferencesService } from './jobs-user-preferences.service';

describe('JobsUserPreferencesService', () => {
  let service: JobsUserPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobsUserPreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
