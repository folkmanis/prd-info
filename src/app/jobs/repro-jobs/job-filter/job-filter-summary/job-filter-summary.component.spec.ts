import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobFilterSummaryComponent } from './job-filter-summary.component';

describe('JobFilterSummaryComponent', () => {
  let component: JobFilterSummaryComponent;
  let fixture: ComponentFixture<JobFilterSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobFilterSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobFilterSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
