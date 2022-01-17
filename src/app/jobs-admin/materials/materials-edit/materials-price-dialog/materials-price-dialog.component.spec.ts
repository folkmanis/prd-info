import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsPriceDialogComponent } from './materials-price-dialog.component';

describe('MaterialsPriceDialogComponent', () => {
  let component: MaterialsPriceDialogComponent;
  let fixture: ComponentFixture<MaterialsPriceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialsPriceDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsPriceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
