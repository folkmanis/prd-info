import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasutijumsEditComponent } from './pasutijums-edit.component';

describe('PasutijumsEditComponent', () => {
  let component: PasutijumsEditComponent;
  let fixture: ComponentFixture<PasutijumsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasutijumsEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasutijumsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
