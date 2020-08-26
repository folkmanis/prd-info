import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasutijumiTabulaComponent } from './pasutijumi-tabula.component';

describe('PasutijumiTabulaComponent', () => {
  let component: PasutijumiTabulaComponent;
  let fixture: ComponentFixture<PasutijumiTabulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasutijumiTabulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasutijumiTabulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
