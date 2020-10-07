import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { identity, pickBy } from 'lodash';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { JobQueryFilter, JobsSettings } from 'src/app/interfaces';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { CustomersService, SystemPreferencesService } from 'src/app/services';
import { JobService } from 'src/app/services/job.service';

const NULL_CUSTOMER = { CustomerName: undefined, _id: undefined, code: undefined };
const DEFAULT_FILTER: JobQueryFilter = {
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

  customers$ = this.customersService.customers$.pipe(
    map(customers => [NULL_CUSTOMER, ...customers])
  );
  jobStates$ = this.sysPrefService.getModulePreferences('jobs').pipe(
    map((pref: JobsSettings) => pref.jobStates)
  );

  constructor(
    private fb: FormBuilder,
    private sysPrefService: SystemPreferencesService,
    private customersService: CustomersService,
    private jobService: JobService,
    private destroy$: DestroyService,
  ) { }

  filterForm = this.fb.group({
    name: undefined,
    jobsId: [
      undefined,
      { validators: [Validators.pattern(/^[0-9]+$/)] }
    ],
    customer: undefined,
    jobStatus: undefined,
  });
  get jobsId(): FormControl { return this.filterForm.get('jobsId') as FormControl; }
  get name(): FormControl { return this.filterForm.get('name') as FormControl; }
  get customer(): FormControl { return this.filterForm.get('customer') as FormControl; }

  ngOnInit(): void {
    this.filterForm.valueChanges.pipe(
      filter(val => this.filterForm.valid),
      debounceTime(500),
      map(normalizeFilter),
      takeUntil(this.destroy$),
    ).subscribe(fltr => this.jobService.setFilter(fltr));
    this.onReset();
  }

  onReset() {
    this.filterForm.setValue(DEFAULT_FILTER);
  }

}

function normalizeFilter(jobFilter: { [key: string]: string | number[]; }): JobQueryFilter {
  return pickBy(
    {
      jobsId: jobFilter.jobsId ? +jobFilter.jobsId : undefined,
      name: jobFilter.name ? jobFilter.name as string : undefined,
      customer: jobFilter.customer ? jobFilter.customer as string : undefined,
      jobStatus: jobFilter.jobStatus.length ? jobFilter.jobStatus : undefined,
      unwindProducts: 1,
    } as JobQueryFilter,
    identity
  );
}
