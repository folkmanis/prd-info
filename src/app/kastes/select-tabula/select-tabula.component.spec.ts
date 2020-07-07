import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTabulaComponent } from './select-tabula.component';

describe('SelectTabulaComponent', () => {
  let component: SelectTabulaComponent;
  let fixture: ComponentFixture<SelectTabulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTabulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTabulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
