import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportNewJobsComponent } from './import-new-jobs.component';

describe('ImportNewJobsComponent', () => {
  let component: ImportNewJobsComponent;
  let fixture: ComponentFixture<ImportNewJobsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportNewJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportNewJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
