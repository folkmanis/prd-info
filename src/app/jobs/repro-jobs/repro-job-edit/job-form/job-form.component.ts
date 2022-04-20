import { Input, Output, ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { addDays, subDays } from 'date-fns';
import { isEqual, pickBy } from 'lodash';
import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { CustomerPartial, SystemPreferences } from 'src/app/interfaces';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { LoginService } from 'src/app/login';
import { CustomersService, LayoutService, ProductsService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { FileUploadMessage, Job } from '../../../interfaces';
import { JobService } from '../../../services/job.service';
import { JobFormGroup } from '../../services/job-form-group';
import { log } from 'prd-cdk';
import { CustomerInputComponent } from '../customer-input/customer-input.component';


@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobFormComponent implements OnInit {

  @ViewChild(CustomerInputComponent) customerInput: CustomerInputComponent;


  private _fileUploadProgress: FileUploadMessage[] = [];
  @Input()
  get fileUploadProgress() {
    return this._fileUploadProgress;
  }
  set fileUploadProgress(value: FileUploadMessage[]) {
    if (value instanceof Array) {
      this._fileUploadProgress = value;
    }
  }


  isLarge$: Observable<boolean> = this.layoutService.isLarge$;
  isSmall$ = this.layoutService.isSmall$;

  customers$: Observable<CustomerPartial[]> = this.customersService.customers$.pipe(
    map(customers => customers.filter(customer => !customer.disabled)),
  );

  receivedDate = {
    min: subDays(Date.now(), 5),
    max: addDays(Date.now(), 3),
  };

  jobStates$ = this.config$.pipe(
    pluck('jobs', 'jobStates'),
    map(states => states.filter(st => st.state < 50))
  );
  categories$ = this.config$.pipe(
    pluck('jobs', 'productCategories'),
  );

  jobIdAndName$ = this.form.value$.pipe(
    map(job => this.jobIdAndName(job)),
  );

  customerProducts$ = this.form.value$.pipe(
    pluck('customer'),
    filter(customer => !!customer),
    distinctUntilChanged(),
    switchMap(customer => this.productsService.productsCustomer(customer)),
  );

  showPrices$: Observable<boolean> = this.loginService.isModule('calculations');

  folderPath$ = this.form.value$.pipe(
    pluck('files'),
    map(files => files?.path?.join('/'))
  );

  get nameControl() {
    return this.form.get('name') as FormControl;
  }


  get isNew(): boolean {
    return !this.form.value.jobId;
  }

  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private layoutService: LayoutService,
    private productsService: ProductsService,
    private customersService: CustomersService,
    private sanitize: SanitizeService,
    private loginService: LoginService,
    private jobsService: JobService,
    public form: JobFormGroup,
  ) { }

  ngOnInit(): void {


  }

  onCreateFolder() {
    const jobId = this.form.value.jobId as number;
    this.jobsService.createFolder(jobId).pipe(
      pluck('files'),
    )
      .subscribe(files => this.form.controls.files.setValue(files));
  }


  private jobIdAndName(job: Job) {
    const name = this.sanitize.sanitizeFileName(job.name);
    return `${job.jobId}-${name}`;
  }


}
