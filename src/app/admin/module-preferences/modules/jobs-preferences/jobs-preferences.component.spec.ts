import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobsPreferencesComponent } from './jobs-preferences.component';

describe('JobsPreferencesComponent', () => {
  let component: JobsPreferencesComponent;
  let fixture: ComponentFixture<JobsPreferencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [JobsPreferencesComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
