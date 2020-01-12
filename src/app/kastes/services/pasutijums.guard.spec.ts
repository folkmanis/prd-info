import { TestBed, async, inject } from '@angular/core/testing';

import { PasutijumsGuard } from './pasutijums.guard';

describe('PasutijumsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasutijumsGuard]
    });
  });

  it('should ...', inject([PasutijumsGuard], (guard: PasutijumsGuard) => {
    expect(guard).toBeTruthy();
  }));
});
