import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Observable, debounceTime, filter, map, startWith, switchMap } from 'rxjs';
import { CustomerPartial, ProductPartial } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';
import { getConfig } from 'src/app/services/config.provider';
import { DEFAULT_FILTER, JobFilter, JobQueryFilter } from '../../interfaces';
import { JobService } from '../../services/job.service';


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
    name: [null],
    jobsId: ['', [Validators.pattern(/^[0-9]+$/)]],
    customer: [''],
    jobStatus: [[] as number[]],
    productsName: [null],
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

    this.filterForm.reset(undefined, { emitEvent: false });
    if (value instanceof JobQueryFilter) {
      this.filterForm.patchValue(value.jobListFilter(), { emitEvent: false });
    }
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

