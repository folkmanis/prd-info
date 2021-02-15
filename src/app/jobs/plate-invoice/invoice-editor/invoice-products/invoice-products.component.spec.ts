import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceProductsComponent } from './invoice-products.component';

describe('InvoiceProductsComponent', () => {
  let component: InvoiceProductsComponent;
  let fixture: ComponentFixture<InvoiceProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
