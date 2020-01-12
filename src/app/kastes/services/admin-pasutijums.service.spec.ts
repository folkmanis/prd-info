import { TestBed } from '@angular/core/testing';

import { AdminPasutijumsService } from './admin-pasutijums.service';

describe('AdminPasutijumsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdminPasutijumsService = TestBed.get(AdminPasutijumsService);
    expect(service).toBeTruthy();
  });
});
