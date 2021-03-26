import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPricesTableComponent } from './job-prices-table.component';

describe('JobPricesTableComponent', () => {
  let component: JobPricesTableComponent;
  let fixture: ComponentFixture<JobPricesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPricesTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPricesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
