import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytraqCustomerTableComponent } from './paytraq-customer-table.component';

describe('PaytraqCustomerTableComponent', () => {
  let component: PaytraqCustomerTableComponent;
  let fixture: ComponentFixture<PaytraqCustomerTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaytraqCustomerTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytraqCustomerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
