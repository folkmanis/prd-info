import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { JobsWithoutInvoicesComponent } from './jobs-without-invoices.component';

describe('JobsWithoutInvoicesComponent', () => {
  let component: JobsWithoutInvoicesComponent;
  let fixture: ComponentFixture<JobsWithoutInvoicesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsWithoutInvoicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsWithoutInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
