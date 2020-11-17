import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportNewPricesComponent } from './import-new-prices.component';

describe('ImportNewPricesComponent', () => {
  let component: ImportNewPricesComponent;
  let fixture: ComponentFixture<ImportNewPricesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportNewPricesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportNewPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
