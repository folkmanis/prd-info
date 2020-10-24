import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPricesComponent } from './product-prices.component';

describe('ProductPricesComponent', () => {
  let component: ProductPricesComponent;
  let fixture: ComponentFixture<ProductPricesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductPricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
