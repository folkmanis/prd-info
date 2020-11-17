import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobDialogComponent } from './job-dialog.component';

describe('JobDialogComponent', () => {
  let component: JobDialogComponent;
  let fixture: ComponentFixture<JobDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
