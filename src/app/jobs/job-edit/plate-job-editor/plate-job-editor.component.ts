import { Component, HostListener, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { IFormGroup } from '@rxweb/types';
import * as moment from 'moment';
import { combineLatest, merge, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, pluck, shareReplay, startWith, switchMap, withLatestFrom } from 'rxjs/operators';
import { CustomerPartial, CustomerProduct, JobBase, SystemPreferences } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { CustomersService, ProductsService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { FolderPath } from '../services/folder-path';
import { JobEditFormService } from '../services/job-edit-form.service';

@Component({
  selector: 'app-plate-job-editor',
  templateUrl: './plate-job-editor.component.html',
  styleUrls: ['./plate-job-editor.component.scss']
})
export class PlateJobEditorComponent implements OnInit, OnDestroy {
  @Input() jobFormGroup: IFormGroup<JobBase>;

  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private customersService: CustomersService,
    private clipboard: ClipboardService,
    private layoutService: LayoutService,
    private productsService: ProductsService,
  ) { }

  get customerControl() { return this.jobFormGroup.controls.customer; }
  get nameControl() { return this.jobFormGroup.controls.name; }
  get productsControl() { return this.jobFormGroup.controls.products; }

  customers$: Observable<CustomerPartial[]>;
  defaultPath$: Observable<string[]>;
  jobStates$ = this.config$.pipe(
    pluck('jobs', 'jobStates'),
    map(states => states.filter(st => st.state < 50))
  );
  categories$ = this.config$.pipe(
    pluck('jobs', 'productCategories'),
  );
  customerProducts$: Observable<CustomerProduct[]>;
  job$: Observable<JobBase>;

  large$: Observable<boolean> = this.layoutService.isLarge$;

  receivedDate = {
    min: moment().startOf('week'),
    max: moment().endOf('week'),
  };

  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.code === 'KeyC' && event.ctrlKey && !event.altKey) {
      this.copyJobIdAndName();
      event.preventDefault();
    }
  }

  ngOnInit(): void {

    this.job$ = merge(
      this.jobFormGroup.valueChanges,
      of(this.jobFormGroup.value)
    ).pipe(
      // map(jobFrm => ({ ...this._job, ...jobFrm })),
      debounceTime(200),
      withLatestFrom(this.customersService.customers$),
      map(([job, customers]) => ({ ...job, custCode: customers.find(cust => cust.CustomerName === job.customer)?.code })),
    );

    this.customerProducts$ = this.job$.pipe(
      map(job => job?.customer),
      distinctUntilChanged(),
      switchMap(customer => this.productsService.productsCustomer(customer || 'NULL')),
      shareReplay(1),
    );

    this.customers$ = combineLatest([
      this.customersService.customers$.pipe(
        map(customers => customers.filter(cust => !cust.disabled)),
      ),
      this.customerControl.valueChanges.pipe(
        startWith(''),
      ),
    ]).pipe(
      map(filterCustomer)
    );

    this.defaultPath$ = this.job$.pipe(
      map(job => FolderPath.toArray(job)),
    );

  }

  ngOnDestroy(): void {
  }

  isProductsSet(): boolean {
    return this.customerControl.valid || (this.productsControl.value instanceof Array && this.productsControl.value.length > 0);
  }

  copyJobIdAndName() {
    this.clipboard.copy(`${this.jobFormGroup.value.jobId}-${this.jobFormGroup.value.name}`);
  }


}

function filterCustomer([customers, value]: [CustomerPartial[], string]): CustomerPartial[] {
  const filterValue = new RegExp(value, 'i');
  return customers.filter(state => filterValue.test(state.CustomerName));
}
