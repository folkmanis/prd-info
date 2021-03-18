import { Component, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, pluck, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { CustomerPartial, JobQueryFilter, JobQueryFilterOptions, SystemPreferences } from 'src/app/interfaces';
import { DestroyService } from 'prd-cdk';
import { CustomersService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { JobService } from 'src/app/services/job.service';

type JobFilter = Pick<JobQueryFilter, 'customer' | 'jobsId' | 'name' | 'jobStatus'>;

const DEFAULT_FILTER = {
  jobsId: null,
  name: '',
  customer: '',
  jobStatus: [10, 20]
};

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.scss'],
  providers: [DestroyService],
})
export class JobFilterComponent implements OnInit {

  jobStates$ = this.config$.pipe(
    pluck('jobs', 'jobStates')
  );
  customersFiltered$: Observable<CustomerPartial[]>;

  filterForm: IFormGroup<JobFilter> = this.fb.group({
    name: undefined,
    jobsId: [
      undefined,
      { validators: [Validators.pattern(/^[0-9]+$/)] }
    ],
    customer: undefined,
    jobStatus: undefined,
  });;

  @Output('jobFilter') jobFilter$: Observable<JobFilter> = this.filterForm.valueChanges.pipe(
    filter(_ => this.filterForm.valid),
    debounceTime(500),
    map(normalizeFilter),
  );

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }


  ngOnInit(): void {

    this.customersFiltered$ = this.filterForm.controls.customer.valueChanges.pipe(
      debounceTime(200),
      startWith(''),
      map(val => val.toUpperCase()),
      switchMap(val => this.customersService.customers$.pipe(
        map(cust => cust.filter(c => c.CustomerName.toUpperCase().includes(val)))
      )),
    );

    this.onReset();

  }

  onReset(key?: keyof JobFilter) {
    if (key) {
      this.filterForm.controls[key].setValue(DEFAULT_FILTER[key]);
    } else {
      this.filterForm.setValue(DEFAULT_FILTER);
    }
  }

}

function normalizeFilter(jobFilter: JobQueryFilter): JobQueryFilter {
  return {
    jobsId: jobFilter.jobsId ? +jobFilter.jobsId : undefined,
    name: jobFilter.name ? jobFilter.name : undefined,
    customer: jobFilter.customer ? jobFilter.customer : undefined,
    jobStatus: jobFilter.jobStatus?.length ? jobFilter.jobStatus : undefined,
    unwindProducts: 0,
  };
}
