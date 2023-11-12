import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { KastesPreferencesComponent } from './kastes-preferences.component';

describe('KastesPreferencesComponent', () => {
  let component: KastesPreferencesComponent;
  let fixture: ComponentFixture<KastesPreferencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [KastesPreferencesComponent]
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
