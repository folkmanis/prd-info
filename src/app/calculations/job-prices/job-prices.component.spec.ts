import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPricesComponent } from './job-prices.component';

describe('JobPricesComponent', () => {
  let component: JobPricesComponent;
  let fixture: ComponentFixture<JobPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobPricesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
