import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabulaComponent } from './tabula.component';

describe('TabulaComponent', () => {
  let component: TabulaComponent;
  let fixture: ComponentFixture<TabulaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
