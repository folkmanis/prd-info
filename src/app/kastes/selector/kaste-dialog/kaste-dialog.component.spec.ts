import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KasteDialogComponent } from './kaste-dialog.component';

describe('KasteDialogComponent', () => {
  let component: KasteDialogComponent;
  let fixture: ComponentFixture<KasteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KasteDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KasteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
