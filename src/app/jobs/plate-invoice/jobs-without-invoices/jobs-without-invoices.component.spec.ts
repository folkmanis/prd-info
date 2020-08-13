import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsWithoutInvoicesComponent } from './jobs-without-invoices.component';

describe('JobsWithoutInvoicesComponent', () => {
  let component: JobsWithoutInvoicesComponent;
  let fixture: ComponentFixture<JobsWithoutInvoicesComponent>;

  beforeEach(async(() => {
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
