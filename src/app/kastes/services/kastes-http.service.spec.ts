import { TestBed } from '@angular/core/testing';

import { KastesHttpService } from './kastes-http.service';

describe('HttpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KastesHttpService = TestBed.get(KastesHttpService);
    expect(service).toBeTruthy();
  });
});
