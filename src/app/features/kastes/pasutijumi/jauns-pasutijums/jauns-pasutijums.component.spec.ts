import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JaunsPasutijumsComponent } from './jauns-pasutijums.component';

describe('JaunsPasutijumsComponent', () => {
  let component: JaunsPasutijumsComponent;
  let fixture: ComponentFixture<JaunsPasutijumsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JaunsPasutijumsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JaunsPasutijumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
