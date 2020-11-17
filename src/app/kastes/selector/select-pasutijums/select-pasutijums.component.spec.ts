import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectPasutijumsComponent } from './select-pasutijums.component';

describe('SelectPasutijumsComponent', () => {
  let component: SelectPasutijumsComponent;
  let fixture: ComponentFixture<SelectPasutijumsComponent>;

  beforeEach(waitForAsync(() => {
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
