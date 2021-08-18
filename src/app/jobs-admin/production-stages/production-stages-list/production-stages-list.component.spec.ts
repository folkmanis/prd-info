import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionStagesListComponent } from './production-stages-list.component';

describe('ProductionStagesListComponent', () => {
  let component: ProductionStagesListComponent;
  let fixture: ComponentFixture<ProductionStagesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionStagesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionStagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
