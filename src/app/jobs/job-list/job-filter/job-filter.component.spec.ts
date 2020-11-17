import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobFilterComponent } from './job-filter.component';

describe('JobFilterComponent', () => {
  let component: JobFilterComponent;
  let fixture: ComponentFixture<JobFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
