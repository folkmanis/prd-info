import { Input, Output, ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
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
import { JobFormService } from '../../services/job-form.service';
import { log } from 'prd-cdk';
import { CustomerInputComponent } from '../customer-input/customer-input.component';
import { FolderPathComponent } from '../folder-path/folder-path.component';


@Component({
  selector: 'app-job-form',
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobFormComponent implements OnInit {

  @ViewChild(CustomerInputComponent) customerInput: CustomerInputComponent;

  @ViewChild(FolderPathComponent) folderPathComponent: FolderPathComponent;

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

  form = this.formService.form;


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

  jobIdAndName$ = this.formService.value$.pipe(
    map(job => this.jobIdAndName(job)),
  );

  customerProducts$ = this.formService.value$.pipe(
    pluck('customer'),
    filter(customer => !!customer),
    distinctUntilChanged(),
    switchMap(customer => this.productsService.productsCustomer(customer)),
  );

  showPrices$: Observable<boolean> = this.loginService.isModule('calculations');

  folderPath$ = this.formService.value$.pipe(
    pluck('files'),
    map(files => files?.path?.join('/'))
  );

  get updateFolderLocation(): boolean {
    return this.folderPathComponent.updatePath;
  }

  updateFolderLocationEnabled$: Observable<boolean> = this.formService.update$.pipe(
    map(upd => !!upd && (!!upd.customer || !!upd.name || !!upd.receivedDate)),
  );

  get nameControl() {
    return this.formService.form.controls.name;
  }


  get isNew(): boolean {
    return !this.formService.value.jobId;
  }

  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private layoutService: LayoutService,
    private productsService: ProductsService,
    private customersService: CustomersService,
    private sanitize: SanitizeService,
    private loginService: LoginService,
    private jobsService: JobService,
    private formService: JobFormService,
  ) { }

  ngOnInit(): void {
  }

  onCreateFolder() {
    const jobId = this.formService.value.jobId;
    this.jobsService.createFolder(jobId).pipe(
      map(job => job.files),
    )
      .subscribe(files => this.formService.form.controls.files.setValue(files));
  }


  private jobIdAndName(job: Partial<Job>) {
    const name = this.sanitize.sanitizeFileName(job.name);
    return `${job.jobId}-${name}`;
  }


}
