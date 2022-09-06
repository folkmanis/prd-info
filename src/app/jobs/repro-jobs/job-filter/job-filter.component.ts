import { ChangeDetectionStrategy, Component, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap } from 'rxjs/operators';
import { CustomerPartial } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';
import { getConfig } from 'src/app/services/config.provider';
import { JobFilter, JobQueryFilter } from '../../interfaces';


const DEFAULT_FILTER: JobFilter = {
  jobsId: null,
  name: '',
  customer: '',
  jobStatus: [10, 20]
};

export type FilterFormType = {
  [k in keyof JobFilter]: FormControl<JobFilter[k]>
};

export abstract class JobFilterFormProvider {
  abstract filterForm: FormGroup<FilterFormType>;
}

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: JobFilterFormProvider, useExisting: JobFilterComponent }
  ]
})
export class JobFilterComponent implements JobFilterFormProvider, OnInit {

  jobStates$ = getConfig('jobs', 'jobStates');

  customersFiltered$: Observable<CustomerPartial[]>;

  filterForm: FormGroup<FilterFormType> = new FormGroup({
    name: new FormControl(''),
    jobsId: new FormControl('', { validators: [Validators.pattern(/^[0-9]+$/)] }),
    customer: new FormControl(''),
    jobStatus: new FormControl([]),
  });;

  @Output('jobFilter') jobFilter$: Observable<JobQueryFilter> = this.filterForm.valueChanges.pipe(
    filter(_ => this.filterForm.valid),
    debounceTime(500),
    map(normalizeFilter),
  );

  constructor(
    private customersService: CustomersService,
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

    this.filterForm.setValue(DEFAULT_FILTER);

  }

  onReset<T extends keyof JobFilter>(key?: T) {
    if (key) {
      this.filterForm.controls[key].setValue(DEFAULT_FILTER[key]);
    } else {
      this.filterForm.setValue(DEFAULT_FILTER);
    }
  }

}

function normalizeFilter(jobFilter: JobFilter): JobQueryFilter {
  return {
    jobsId: jobFilter.jobsId ? [+jobFilter.jobsId] : undefined,
    name: jobFilter.name ? jobFilter.name : undefined,
    customer: jobFilter.customer ? jobFilter.customer : undefined,
    jobStatus: jobFilter.jobStatus?.length ? jobFilter.jobStatus : undefined,
    unwindProducts: 0,
  };
}
