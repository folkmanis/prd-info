import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobImportComponent } from './job-import.component';

describe('JobImportComponent', () => {
  let component: JobImportComponent;
  let fixture: ComponentFixture<JobImportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
