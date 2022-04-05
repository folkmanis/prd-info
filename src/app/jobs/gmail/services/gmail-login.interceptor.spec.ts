import { TestBed } from '@angular/core/testing';

import { GmailLoginInterceptor } from './gmail-login.interceptor';

describe('GmailLoginInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      GmailLoginInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: GmailLoginInterceptor = TestBed.inject(GmailLoginInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
