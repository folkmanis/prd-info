import { TestBed } from '@angular/core/testing';

import { KastesLocalStorageInterceptor } from './kastes-local-storage.interceptor';

describe('KastesLocalStorageInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      KastesLocalStorageInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: KastesLocalStorageInterceptor = TestBed.inject(KastesLocalStorageInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
