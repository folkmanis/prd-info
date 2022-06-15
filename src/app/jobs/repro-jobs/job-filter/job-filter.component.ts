import { ChangeDetectionStrategy, Component, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, pluck, startWith, switchMap } from 'rxjs/operators';
import { CustomerPartial, SystemPreferences } from 'src/app/interfaces';
import { CustomersService, SystemPreferencesService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { JobQueryFilter, JobFilter } from '../../interfaces';
import { LayoutService } from 'src/app/services';


const DEFAULT_FILTER: JobFilter = {
  jobsId: null,
  name: '',
  customer: '',
  jobStatus: [10, 20]
};

export abstract class JobFilterFormProvider {
  abstract filterForm: UntypedFormGroup;
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

  jobStates$ = this.config$.pipe(
    pluck('jobs', 'jobStates')
  );
  customersFiltered$: Observable<CustomerPartial[]>;

  filterForm: UntypedFormGroup = this.fb.group({
    name: undefined,
    jobsId: [
      undefined,
      { validators: [Validators.pattern(/^[0-9]+$/)] }
    ],
    customer: undefined,
    jobStatus: [],
  });;

  @Output('jobFilter') jobFilter$: Observable<JobQueryFilter> = this.filterForm.valueChanges.pipe(
    filter(_ => this.filterForm.valid),
    debounceTime(500),
    map(normalizeFilter),
  );

  large$ = this.layout.isLarge$;

  constructor(
    private fb: UntypedFormBuilder,
    private customersService: CustomersService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private layout: LayoutService,
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
