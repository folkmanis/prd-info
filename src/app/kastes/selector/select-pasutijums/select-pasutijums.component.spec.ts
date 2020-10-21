import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPasutijumsComponent } from './select-pasutijums.component';

describe('SelectPasutijumsComponent', () => {
  let component: SelectPasutijumsComponent;
  let fixture: ComponentFixture<SelectPasutijumsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPasutijumsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPasutijumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
