import { TestBed } from '@angular/core/testing';

import { MaterialsResolverService } from './materials-resolver.service';

describe('MaterialsResolverService', () => {
  let service: MaterialsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
