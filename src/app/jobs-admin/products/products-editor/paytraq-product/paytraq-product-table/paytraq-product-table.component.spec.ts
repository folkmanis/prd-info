import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytraqProductTableComponent } from './paytraq-product-table.component';

describe('PaytraqProductTableComponent', () => {
  let component: PaytraqProductTableComponent;
  let fixture: ComponentFixture<PaytraqProductTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaytraqProductTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytraqProductTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
