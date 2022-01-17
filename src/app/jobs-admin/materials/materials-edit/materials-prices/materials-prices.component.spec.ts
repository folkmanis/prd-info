import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsPricesComponent } from './materials-prices.component';

describe('MaterialsPricesComponent', () => {
  let component: MaterialsPricesComponent;
  let fixture: ComponentFixture<MaterialsPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialsPricesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
