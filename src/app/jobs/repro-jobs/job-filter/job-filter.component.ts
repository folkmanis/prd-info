import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap } from 'rxjs/operators';
import { CustomerPartial } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';
import { getConfig } from 'src/app/services/config.provider';
import { JobFilter, JobQueryFilter } from '../../interfaces';
import { JobService } from '../../services/job.service';


const DEFAULT_FILTER: JobFilter = {
  jobsId: null,
  name: '',
  customer: '',
  jobStatus: [10, 20]
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
export class JobFilterComponent implements OnInit {

  jobStates$ = getConfig('jobs', 'jobStates');

  customersFiltered$: Observable<CustomerPartial[]>;

  filterForm: FormGroup<FilterFormType> = new FormGroup({
    name: new FormControl(''),
    jobsId: new FormControl('', { validators: [Validators.pattern(/^[0-9]+$/)] }),
    customer: new FormControl(''),
    jobStatus: new FormControl([]),
  });;

  @Input()
  set filter(value: JobQueryFilter) {
    const filter = {
      name: value.name || DEFAULT_FILTER.name,
      jobsId: Array.isArray(value.jobsId) ? value.jobsId[0].toString() : DEFAULT_FILTER.jobsId,
      customer: value.customer || DEFAULT_FILTER.customer,
      jobStatus: value.jobStatus || DEFAULT_FILTER.jobStatus,
    };
    this.filterForm.setValue(filter, { emitEvent: false });
  }
  get filter() {
    return this.jobService.normalizeFilter(this.filterForm.value);
  }

  @Output() filterChanges: Observable<JobQueryFilter> = this.filterForm.valueChanges.pipe(
    filter(_ => this.filterForm.valid),
    debounceTime(300),
    map(() => this.filter),
  );

  constructor(
    private customersService: CustomersService,
    private jobService: JobService,
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

  }

  onReset<T extends keyof JobFilter>(key?: T) {
    if (key) {
      this.filterForm.controls[key].setValue(DEFAULT_FILTER[key]);
    } else {
      this.filterForm.setValue(DEFAULT_FILTER);
    }
  }

}

