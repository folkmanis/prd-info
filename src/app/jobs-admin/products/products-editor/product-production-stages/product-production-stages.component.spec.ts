import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductProductionStagesComponent } from './product-production-stages.component';

describe('ProductProductionStagesComponent', () => {
  let component: ProductProductionStagesComponent;
  let fixture: ComponentFixture<ProductProductionStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductProductionStagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductProductionStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
