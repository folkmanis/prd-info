import { TestBed } from '@angular/core/testing';

import { LoginEffectsService } from './login-effects.service';

describe('LoginEffectsService', () => {
  let service: LoginEffectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginEffectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
