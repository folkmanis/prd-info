import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobsAdminComponent } from './jobs-admin.component';

describe('JobsAdminComponent', () => {
  let component: JobsAdminComponent;
  let fixture: ComponentFixture<JobsAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
