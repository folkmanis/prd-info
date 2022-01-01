import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsProductionComponent } from './products-production.component';

describe('ProductsProductionComponent', () => {
  let component: ProductsProductionComponent;
  let fixture: ComponentFixture<ProductsProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsProductionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
