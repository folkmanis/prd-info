import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApjomiTotalsComponent } from './apjomi-totals.component';

describe('ApjomiTotalsComponent', () => {
  let component: ApjomiTotalsComponent;
  let fixture: ComponentFixture<ApjomiTotalsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApjomiTotalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApjomiTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
