import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KastesPreferencesComponent } from './kastes-preferences.component';

describe('KastesPreferencesComponent', () => {
  let component: KastesPreferencesComponent;
  let fixture: ComponentFixture<KastesPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KastesPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KastesPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
