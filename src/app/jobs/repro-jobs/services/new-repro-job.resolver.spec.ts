import { TestBed } from '@angular/core/testing';

import { NewReproJobResolver } from './new-repro-job.resolver';

describe('NewReproJobResolver', () => {
  let resolver: NewReproJobResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(NewReproJobResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
