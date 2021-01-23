import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SystemPreferencesComponent } from './system-preferences.component';

describe('SystemPreferencesComponent', () => {
  let component: SystemPreferencesComponent;
  let fixture: ComponentFixture<SystemPreferencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemPreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
