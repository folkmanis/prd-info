import { TestBed } from '@angular/core/testing';

import { LogfileService } from './logfile.service';

describe('LogfileService', () => {
  let service: LogfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
