import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePaytraqComponent } from './invoice-paytraq.component';

describe('InvoicePaytraqComponent', () => {
  let component: InvoicePaytraqComponent;
  let fixture: ComponentFixture<InvoicePaytraqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoicePaytraqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePaytraqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
