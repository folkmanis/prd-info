import { TestBed } from '@angular/core/testing';

import { UploadRefService } from './upload-ref.service';

describe('UserFileUploadService', () => {
  let service: UploadRefService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadRefService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
