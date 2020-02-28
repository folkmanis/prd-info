import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabulaComponent } from './tabula.component';

describe('TabulaComponent', () => {
  let component: TabulaComponent;
  let fixture: ComponentFixture<TabulaComponent>;

  beforeEach(async(() => {
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
