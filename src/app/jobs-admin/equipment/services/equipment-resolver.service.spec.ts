import { TestBed } from '@angular/core/testing';

import { EquipmentResolverService } from './equipment-resolver.service';

describe('EquipmentResolverService', () => {
  let service: EquipmentResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
