import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasutijumiComponent } from './pasutijumi.component';

describe('PasutijumiComponent', () => {
  let component: PasutijumiComponent;
  let fixture: ComponentFixture<PasutijumiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasutijumiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasutijumiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
