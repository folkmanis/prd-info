import { TestBed } from '@angular/core/testing';

import { AdminHttpService } from './admin-http.service';

describe('HttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminHttpService = TestBed.get(AdminHttpService);
    expect(service).toBeTruthy();
  });
});
