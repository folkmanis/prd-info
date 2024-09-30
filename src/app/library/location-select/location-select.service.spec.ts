import { TestBed } from '@angular/core/testing';

import { LocationSelectService } from './location-select.service';

describe('LocationSelectService', () => {
  let service: LocationSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
