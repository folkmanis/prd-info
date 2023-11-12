import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitsDialogComponent } from './units-dialog.component';

describe('UnitsDialogComponent', () => {
  let component: UnitsDialogComponent;
  let fixture: ComponentFixture<UnitsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [UnitsDialogComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
