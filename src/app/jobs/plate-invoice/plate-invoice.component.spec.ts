import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlateInvoiceComponent } from './plate-invoice.component';

describe('PlateInvoiceComponent', () => {
  let component: PlateInvoiceComponent;
  let fixture: ComponentFixture<PlateInvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlateInvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlateInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
