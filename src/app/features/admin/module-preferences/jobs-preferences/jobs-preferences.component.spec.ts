import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsPreferencesComponent } from './jobs-preferences.component';

describe('JobsPreferencesComponent', () => {
  let component: JobsPreferencesComponent;
  let fixture: ComponentFixture<JobsPreferencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsPreferencesComponent ]
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
