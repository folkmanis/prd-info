import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { CustomerPartial, JobQueryFilter, JobQueryFilterOptions, JobsSettings } from 'src/app/interfaces';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { CustomersService, SystemPreferencesService } from 'src/app/services';
import { JobService } from 'src/app/services/job.service';

type JobFilter = Pick<JobQueryFilterOptions, 'customer' | 'jobsId' | 'name' | 'jobStatus'>;

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

  jobStates$ = this.sysPrefService.preferences$.pipe(
    map(pref => pref.jobs.jobStates)
  );
  customersFiltered$: Observable<CustomerPartial[]>;

  private fb: IFormBuilder;
  filterForm: IFormGroup<JobFilter>;

  constructor(
    fb: FormBuilder,
    private sysPrefService: SystemPreferencesService,
    private customersService: CustomersService,
    private jobService: JobService,
    private destroy$: DestroyService,
  ) {
    this.fb = fb;
    this.filterForm = this.fb.group<JobFilter>({
      name: undefined,
      jobsId: [
        undefined,
        { validators: [Validators.pattern(/^[0-9]+$/)] }
      ],
      customer: undefined,
      jobStatus: undefined,
    });
  }


  ngOnInit(): void {

    this.customersFiltered$ = this.filterForm.controls.customer.valueChanges.pipe(
      debounceTime(200),
      startWith(''),
      map(val => val.toUpperCase()),
      switchMap(val => this.customersService.customers$.pipe(
        map(cust => cust.filter(c => c.CustomerName.toUpperCase().includes(val)))
      )),
    );

    this.filterForm.valueChanges.pipe(
      filter(_ => this.filterForm.valid),
      debounceTime(500),
      map(normalizeFilter),
      takeUntil(this.destroy$),
    ).subscribe(fltr => this.jobService.setFilter(fltr));

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
    unwindProducts: 1,
  };
}
