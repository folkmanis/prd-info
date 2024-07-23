import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytraqShippingAddressSelectDialogComponent } from './paytraq-shipping-address-select-dialog.component';

describe('PaytraqShippingAddressSelectDialogComponent', () => {
  let component: PaytraqShippingAddressSelectDialogComponent;
  let fixture: ComponentFixture<PaytraqShippingAddressSelectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaytraqShippingAddressSelectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaytraqShippingAddressSelectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
