import { TestBed } from '@angular/core/testing';

import { UserFileUploadService } from './user-file-upload.service';

describe('UserFileUploadService', () => {
  let service: UserFileUploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFileUploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
