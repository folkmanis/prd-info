import { ChangeDetectionStrategy, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { addDays, subDays } from 'date-fns';
import { EMPTY, merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, startWith, switchMap } from 'rxjs/operators';
import { CustomerPartial, CustomerProduct, SystemPreferences } from 'src/app/interfaces';
import { LayoutService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { CustomersService } from 'src/app/services/customers.service';
import { JobService } from '../../../services/job.service';
import { ProductsService } from 'src/app/services/products.service';
import { JobFormGroup } from '../../services/job-form-group';
import { CustomerInputComponent } from '../customer-input/customer-input.component';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { JobFormProvider } from '../repro-job-edit.component';
import { Job } from 'src/app/jobs/interfaces';
import { LoginService } from 'src/app/login';

@Component({
  selector: 'app-repro-job-form',
  templateUrl: './repro-job-form.component.html',
  styleUrls: ['./repro-job-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReproJobFormComponent implements OnInit {

  @ViewChild(CustomerInputComponent) customerInput: CustomerInputComponent;

  get form(): JobFormGroup {
    return this.formProvider.form;
  }
  get isNew(): boolean {
    return !this.form.value.jobId;
  }

  large$: Observable<boolean> = this.layoutService.isLarge$;

  receivedDate = {
    min: subDays(Date.now(), 5),
    max: addDays(Date.now(), 3),
  };

  get nameControl() {
    return this.form.get('name') as FormControl;
  }

  showPrices$: Observable<boolean> = this.loginService.isModule('calculations');

  jobStates$ = this.config$.pipe(
    pluck('jobs', 'jobStates'),
    map(states => states.filter(st => st.state < 50))
  );
  categories$ = this.config$.pipe(
    pluck('jobs', 'productCategories'),
  );
  folderPath$: Observable<string>;
  customers$: Observable<CustomerPartial[]> = this.customersService.customers$;
  customerProducts$: Observable<CustomerProduct[]>;
  jobIdAndName$: Observable<string>;


  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private layoutService: LayoutService,
    private jobsService: JobService,
    private customersService: CustomersService,
    private productsService: ProductsService,
    private sanitize: SanitizeService,
    private formProvider: JobFormProvider,
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {

    this.customerProducts$ = this.form.value$.pipe(
      pluck('customer'),
      filter(customer => !!customer),
      distinctUntilChanged(),
      switchMap(customer => this.productsService.productsCustomer(customer)),
    );

    this.folderPath$ = this.form.value$.pipe(
      pluck('files'),
      map(files => files?.path?.join('/'))
    );

    this.jobIdAndName$ = this.form.value$.pipe(
      map(job => this.jobIdAndName(job)),
    );

  }

  private jobIdAndName(job: Job) {
    const name = this.sanitize.sanitizeFileName(job.name);
    return `${job.jobId}-${name}`;
  }

  onCreateFolder() {
    const jobId = this.form.value.jobId as number;
    this.jobsService.createFolder(jobId).pipe(
      pluck('files'),
    )
      .subscribe(files => this.form.controls.files.setValue(files));
  }


}
