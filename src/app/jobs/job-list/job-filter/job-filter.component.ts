import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { identity, pickBy } from 'lodash';
import { Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { JobQueryFilter, JobsSettings } from 'src/app/interfaces';
import { CustomersService, SystemPreferencesService } from 'src/app/services';
import { JobService } from '../../services/job.service';

const NULL_CUSTOMER = { CustomerName: undefined, _id: undefined, code: undefined };
const DEFAULT_FILTER: JobQueryFilter = {
  name: '',
  customer: '',
  jobStatus: [10, 20, 30]
};

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.css']
})
export class JobFilterComponent implements OnInit, OnDestroy {

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
  ) { }

  filterForm = this.fb.group({
    name: undefined,
    customer: undefined,
    jobStatus: undefined,
  });
  get name(): FormControl { return this.filterForm.get('name') as FormControl; }
  get customer(): FormControl { return this.filterForm.get('customer') as FormControl; }
  private readonly _subs = new Subscription();

  ngOnInit(): void {
    this._subs.add(
      this.filterForm.valueChanges.pipe(
        debounceTime(500),
        map(normalizeFilter),
      ).subscribe(this.jobService.filter$)
    );
    this.onReset();
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  onReset() {
    this.filterForm.setValue(DEFAULT_FILTER);
  }

}

function normalizeFilter(filter: { [key: string]: string | number[]; }): JobQueryFilter {
  return pickBy(
    {
      name: filter.name ? filter.name as string : undefined,
      customer: filter.customer ? filter.customer as string : undefined,
      jobStatus: filter.jobStatus.length ? filter.jobStatus : undefined,
      unwindProducts: 1,
    } as JobQueryFilter,
    identity
  );
}
