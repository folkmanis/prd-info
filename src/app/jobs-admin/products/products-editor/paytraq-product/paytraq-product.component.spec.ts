import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytraqProductComponent } from './paytraq-product.component';

describe('PaytraqProductComponent', () => {
  let component: PaytraqProductComponent;
  let fixture: ComponentFixture<PaytraqProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaytraqProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytraqProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
