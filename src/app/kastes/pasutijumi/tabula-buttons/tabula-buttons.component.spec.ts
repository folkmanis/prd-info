import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabulaButtonsComponent } from './tabula-buttons.component';

describe('TabulaButtonsComponent', () => {
  let component: TabulaButtonsComponent;
  let fixture: ComponentFixture<TabulaButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabulaButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabulaButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
