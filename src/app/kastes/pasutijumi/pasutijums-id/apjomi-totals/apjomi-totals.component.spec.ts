import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApjomiTotalsComponent } from './apjomi-totals.component';

describe('ApjomiTotalsComponent', () => {
  let component: ApjomiTotalsComponent;
  let fixture: ComponentFixture<ApjomiTotalsComponent>;

  beforeEach(async(() => {
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
