import { TestBed } from '@angular/core/testing';

import { ModulePreferencesService } from './module-preferences.service';

describe('ModulePreferencesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModulePreferencesService = TestBed.get(ModulePreferencesService);
    expect(service).toBeTruthy();
  });
});
