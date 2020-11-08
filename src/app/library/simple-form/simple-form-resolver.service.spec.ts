import { TestBed } from '@angular/core/testing';

import { SimpleFormResolverService } from './simple-form-resolver.service';

describe('SimpleFormResolverService', () => {
  let service: SimpleFormResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimpleFormResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
