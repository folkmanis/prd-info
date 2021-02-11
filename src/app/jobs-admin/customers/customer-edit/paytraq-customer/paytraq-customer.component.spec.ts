import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytraqCustomerComponent } from './paytraq-customer.component';

describe('PaytraqCustomerComponent', () => {
  let component: PaytraqCustomerComponent;
  let fixture: ComponentFixture<PaytraqCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaytraqCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytraqCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
