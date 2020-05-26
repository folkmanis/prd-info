import { TestBed } from '@angular/core/testing';

import { SystemPreferencesService } from './system-preferences.service';

describe('SystemPreferencesService', () => {
  let service: SystemPreferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemPreferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
