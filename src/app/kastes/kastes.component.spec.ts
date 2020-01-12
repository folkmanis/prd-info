import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KastesComponent } from './kastes.component';

describe('KastesComponent', () => {
  let component: KastesComponent;
  let fixture: ComponentFixture<KastesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KastesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KastesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
