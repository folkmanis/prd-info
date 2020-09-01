import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KastesInputComponent } from './kastes-input.component';

describe('KastesInputComponent', () => {
  let component: KastesInputComponent;
  let fixture: ComponentFixture<KastesInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KastesInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KastesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
