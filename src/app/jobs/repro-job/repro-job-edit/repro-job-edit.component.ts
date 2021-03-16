import { Component, OnInit, ChangeDetectionStrategy, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { combineLatest, EMPTY, merge, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, mapTo, pluck, shareReplay, startWith, switchMap, withLatestFrom } from 'rxjs/operators';
import { CustomerPartial, CustomerProduct, Job, JobBase, SystemPreferences } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { CustomersService, ProductsService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { JobService } from 'src/app/services/job.service';
import { JobFormSource } from '../services/job-form-source';
import { startOfWeek, endOfWeek } from 'date-fns';
import { ReproJobResolverService } from '../services/repro-job-resolver.service';
import { FileUploadService } from '../../services/file-upload.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { MatInput } from '@angular/material/input';
import { CustomerInputComponent } from './customer-input/customer-input.component';


@Component({
  selector: 'app-repro-job-edit',
  templateUrl: './repro-job-edit.component.html',
  styleUrls: ['./repro-job-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReproJobEditComponent implements OnInit, CanComponentDeactivate {
  @ViewChild(CustomerInputComponent) set customerInput(value: CustomerInputComponent) {
    console.log(value);
  }

  fileUploadFn = (jobId: number): void => {
    this.fileUploadService.startUpload(jobId).subscribe();
  };

  formSource = new JobFormSource(
    this.fb,
    this.customersService,
    this.jobService,
    this.fileUploadService,
    this.fileUploadFn,
  );

  get form(): IFormGroup<JobBase> {
    return this.formSource.form;
  }
  get customerControl() { return this.form.controls.customer; }
  get nameControl() { return this.form.controls.name; }
  get productsControl() { return this.form.controls.products; }

  get isNew(): boolean { return this.formSource.isNew; }

  large$: Observable<boolean> = this.layoutService.isLarge$;
  customers$: Observable<CustomerPartial[]> = this.customersService.customers$;
  jobStates$ = this.config$.pipe(
    pluck('jobs', 'jobStates'),
    map(states => states.filter(st => st.state < 50))
  );
  categories$ = this.config$.pipe(
    pluck('jobs', 'productCategories'),
  );
  customerProducts$: Observable<CustomerProduct[]>;

  receivedDate = {
    min: startOfWeek(Date.now()),
    max: endOfWeek(Date.now()),
  };

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private jobService: JobService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private clipboard: ClipboardService,
    private layoutService: LayoutService,
    private productsService: ProductsService,
    private resolver: ReproJobResolverService,
    private fileUploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
    const job$ = merge(
      this.form.valueChanges,
      of(this.form.value)
    ).pipe(
      // map(jobFrm => ({ ...this._job, ...jobFrm })),
      debounceTime(200),
      withLatestFrom(this.customersService.customers$),
      map(([job, customers]) => ({ ...job, custCode: customers.find(cust => cust.CustomerName === job.customer)?.code })),
    );

    this.customerProducts$ = job$.pipe(
      map(job => job?.customer),
      distinctUntilChanged(),
      switchMap(customer => this.productsService.productsCustomer(customer || 'NULL')),
      // shareReplay(1),
    );

  }

  onDataChange(data: Partial<JobBase>) {
    console.log(this.customerInput);
    data = this.setNewJobDefaults(data);
    this.formSource.initValue(data);
    if (this.customerInput) {
      this.customerInput.focus();
    }
  }

  copyJobIdAndName() {
    this.clipboard.copy(`${this.form.value.jobId}-${this.form.value.name}`);
  }

  isProductsSet(): boolean {
    return this.customerControl.valid || (this.productsControl.value instanceof Array && this.productsControl.value.length > 0);
  }

  onCreateFolder() {
    this.jobService.updateJob({ jobId: this.form.value.jobId }, { createFolder: true }).pipe(
      switchMap(resp => resp ? this.resolver.reload() : EMPTY),
      pluck('files'),
    ).subscribe(files => {
      this.form.controls.files.setValue(files);
      this.formSource.folderPath$.next(files.path?.join('/'));
    });
  }

  canDeactivate(): boolean {
    return this.form.pristine;
  }

  private setNewJobDefaults(job: Partial<JobBase>): Partial<JobBase> {
    return {
      ...job,
      receivedDate: job.receivedDate || new Date(),
      dueDate: job.dueDate || new Date(),
      jobStatus: {
        generalStatus: job.jobStatus?.generalStatus || 10
      }

    };
  }


}

function filterCustomer([customers, value]: [CustomerPartial[], string]): CustomerPartial[] {
  const filterValue = new RegExp(value, 'i');
  return customers.filter(state => filterValue.test(state.CustomerName));
}
