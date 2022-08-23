import { TestBed } from '@angular/core/testing';

import { AppClassTransformerService } from './app-class-transformer.service';

describe('AppClassTransformerService', () => {
  let service: AppClassTransformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppClassTransformerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
