import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModulePreferencesComponent } from './module-preferences.component';

describe('ModulePreferencesComponent', () => {
  let component: ModulePreferencesComponent;
  let fixture: ComponentFixture<ModulePreferencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulePreferencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulePreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
