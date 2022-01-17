import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionStageMaterialComponent } from './production-stage-material.component';

describe('ProductionStageMaterialComponent', () => {
  let component: ProductionStageMaterialComponent;
  let fixture: ComponentFixture<ProductionStageMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionStageMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionStageMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
