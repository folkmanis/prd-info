import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorTotalsComponent } from './color-totals.component';

describe('ColorTotalsComponent', () => {
  let component: ColorTotalsComponent;
  let fixture: ComponentFixture<ColorTotalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorTotalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
