import { TestBed } from '@angular/core/testing';

import { SystemPreferencesEffectService } from './system-preferences-effect.service';

describe('SystemPreferencesEffectService', () => {
  let service: SystemPreferencesEffectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SystemPreferencesEffectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
