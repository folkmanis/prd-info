import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabulaButtonsComponent } from './tabula-buttons.component';

describe('TabulaButtonsComponent', () => {
  let component: TabulaButtonsComponent;
  let fixture: ComponentFixture<TabulaButtonsComponent>;

  beforeEach(waitForAsync(() => {
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
