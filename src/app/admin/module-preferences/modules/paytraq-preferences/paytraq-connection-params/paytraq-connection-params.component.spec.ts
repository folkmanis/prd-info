import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytraqConnectionParamsComponent } from './paytraq-connection-params.component';

describe('PaytraqConnectionParamsComponent', () => {
  let component: PaytraqConnectionParamsComponent;
  let fixture: ComponentFixture<PaytraqConnectionParamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaytraqConnectionParamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaytraqConnectionParamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
