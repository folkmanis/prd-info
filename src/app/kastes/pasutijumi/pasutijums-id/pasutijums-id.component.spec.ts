import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasutijumsIdComponent } from './pasutijums-id.component';

describe('PasutijumsIdComponent', () => {
  let component: PasutijumsIdComponent;
  let fixture: ComponentFixture<PasutijumsIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasutijumsIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasutijumsIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
