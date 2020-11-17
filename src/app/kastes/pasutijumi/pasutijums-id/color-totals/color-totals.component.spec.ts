import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ColorTotalsComponent } from './color-totals.component';

describe('ColorTotalsComponent', () => {
  let component: ColorTotalsComponent;
  let fixture: ComponentFixture<ColorTotalsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorTotalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
