import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable, debounceTime, filter, map, startWith, switchMap } from 'rxjs';
import { CustomerPartial, ProductPartial } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';
import { getConfig } from 'src/app/services/config.provider';
import { JobFilter, JobQueryFilter } from '../../interfaces';
import { JobService } from '../../services/job.service';


const DEFAULT_FILTER: JobFilter = {
  jobsId: null,
  name: '',
  customer: '',
  jobStatus: [10, 20],
  productsName: '',
};

export type FilterFormType = {
  [k in keyof JobFilter]: FormControl<JobFilter[k]>
};


@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobFilterComponent {

  jobStates$ = getConfig('jobs', 'jobStates');


  filterForm: FormGroup<FilterFormType> = this.fb.group({
    name: [DEFAULT_FILTER.name],
    jobsId: [DEFAULT_FILTER.jobsId, [Validators.pattern(/^[0-9]+$/)]],
    customer: [DEFAULT_FILTER.customer],
    jobStatus: [DEFAULT_FILTER.jobStatus],
    productsName: [DEFAULT_FILTER.productsName],
  });

  customersFiltered$: Observable<CustomerPartial[]> = this.filterForm.controls.customer.valueChanges.pipe(
    debounceTime(200),
    startWith(''),
    map(val => val.toUpperCase()),
    switchMap(val => this.customersService.customers$.pipe(
      map(cust => cust.filter(c => c.CustomerName.toUpperCase().includes(val)))
    )),
  );

  @Input()
  set filter(value: JobQueryFilter) {
    const filter = {
      name: value.name || DEFAULT_FILTER.name,
      jobsId: Array.isArray(value.jobsId) ? value.jobsId[0].toString() : DEFAULT_FILTER.jobsId,
      customer: value.customer || DEFAULT_FILTER.customer,
      jobStatus: value.jobStatus || DEFAULT_FILTER.jobStatus,
      productsName: value.productsName || DEFAULT_FILTER.productsName,
    };
    this.filterForm.setValue(filter, { emitEvent: false });
  }
  get filter() {
    return this.jobService.normalizeFilter(this.filterForm.value);
  }

  @Input() products: ProductPartial[] | null = null;

  @Output() filterChanges: Observable<JobQueryFilter> = this.filterForm.valueChanges.pipe(
    filter(_ => this.filterForm.valid),
    debounceTime(300),
    map(() => this.filter),
  );

  constructor(
    private customersService: CustomersService,
    private jobService: JobService,
    private fb: FormBuilder,
  ) { }


  onReset<T extends keyof JobFilter>(key?: T) {
    if (key) {
      this.filterForm.controls[key].reset(DEFAULT_FILTER[key]);
    } else {
      this.filterForm.reset(DEFAULT_FILTER);
    }
  }

}

