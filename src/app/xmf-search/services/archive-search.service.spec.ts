import { TestBed } from '@angular/core/testing';

import { ArchiveSearchService } from './archive-search.service';

describe('ArchiveSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArchiveSearchService = TestBed.inject(ArchiveSearchService);
    expect(service).toBeTruthy();
  });
});
