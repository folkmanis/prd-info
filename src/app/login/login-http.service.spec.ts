import { TestBed } from '@angular/core/testing';

import { LoginHttpService } from './login-http.service';

describe('LoginHttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginHttpService = TestBed.inject(LoginHttpService);
    expect(service).toBeTruthy();
  });
});
