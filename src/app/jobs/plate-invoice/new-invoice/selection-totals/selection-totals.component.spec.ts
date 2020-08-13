import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionTotalsComponent } from './selection-totals.component';

describe('SelectionTotalsComponent', () => {
  let component: SelectionTotalsComponent;
  let fixture: ComponentFixture<SelectionTotalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionTotalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionTotalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
