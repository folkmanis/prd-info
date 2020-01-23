import { TestBed } from '@angular/core/testing';

import { KastesPreferencesService } from './kastes-preferences.service';

describe('KastesPreferencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KastesPreferencesService = TestBed.get(KastesPreferencesService);
    expect(service).toBeTruthy();
  });
});
