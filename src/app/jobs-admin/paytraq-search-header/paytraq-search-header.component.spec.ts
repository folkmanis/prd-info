import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytraqSearchHeaderComponent } from './paytraq-search-header.component';

describe('PaytraqSearchHeaderComponent', () => {
  let component: PaytraqSearchHeaderComponent;
  let fixture: ComponentFixture<PaytraqSearchHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaytraqSearchHeaderComponent]
    });
    fixture = TestBed.createComponent(PaytraqSearchHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
