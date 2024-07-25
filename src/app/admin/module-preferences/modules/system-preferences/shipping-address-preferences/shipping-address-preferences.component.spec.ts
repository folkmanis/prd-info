import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShippingAddressPreferencesComponent } from './shipping-address-preferences.component';

describe('ShippingAddressPreferencesComponent', () => {
  let component: ShippingAddressPreferencesComponent;
  let fixture: ComponentFixture<ShippingAddressPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShippingAddressPreferencesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShippingAddressPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
