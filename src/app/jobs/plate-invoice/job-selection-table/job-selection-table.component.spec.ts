import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobSelectionTableComponent } from './job-selection-table.component';

describe('JobSelectionTableComponent', () => {
  let component: JobSelectionTableComponent;
  let fixture: ComponentFixture<JobSelectionTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSelectionTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSelectionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
