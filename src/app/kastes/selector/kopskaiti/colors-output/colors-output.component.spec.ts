import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ColorsOutputComponent } from './colors-output.component';

describe('ColorsOutputComponent', () => {
  let component: ColorsOutputComponent;
  let fixture: ComponentFixture<ColorsOutputComponent>;

  // eslint-disable-next-line import/no-deprecated
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorsOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorsOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});