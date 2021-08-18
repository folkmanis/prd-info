import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionStagesEditComponent } from './production-stages-edit.component';

describe('ProductionStagesEditComponent', () => {
  let component: ProductionStagesEditComponent;
  let fixture: ComponentFixture<ProductionStagesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionStagesEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionStagesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
