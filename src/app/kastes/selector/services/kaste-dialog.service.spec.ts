import { TestBed } from '@angular/core/testing';

import { KasteDialogService } from './kaste-dialog.service';

describe('KasteDialogService', () => {
  let service: KasteDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KasteDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
