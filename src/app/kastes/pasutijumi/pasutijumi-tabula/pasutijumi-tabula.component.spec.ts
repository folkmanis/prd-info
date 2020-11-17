import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PasutijumiTabulaComponent } from './pasutijumi-tabula.component';

describe('PasutijumiTabulaComponent', () => {
  let component: PasutijumiTabulaComponent;
  let fixture: ComponentFixture<PasutijumiTabulaComponent>;

  beforeEach(waitForAsync(() => {
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
