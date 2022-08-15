import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { addDays, subDays } from 'date-fns';
import { distinctUntilChanged, filter, map, Observable, switchMap } from 'rxjs';
import { CustomerPartial, SystemPreferences } from 'src/app/interfaces';
import { SanitizeService } from 'src/app/library/services/sanitize.service';
import { LoginService } from 'src/app/login';
import { CustomersService, ProductsService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { Job } from '../../../interfaces';
import { JobFormService } from '../../services/job-form.service';
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

  form = this.formService.form;

  customers$: Observable<CustomerPartial[]> = this.customersService.customers$.pipe(
    map(customers => customers.filter(customer => !customer.disabled)),
  );

  receivedDate = {
    min: subDays(Date.now(), 5),
    max: addDays(Date.now(), 3),
  };

  jobStates$ = this.config$.pipe(
    map(config => config.jobs.jobStates),
    map(states => states.filter(st => st.state < 50))
  );

  categories$ = this.config$.pipe(
    map(config => config.jobs.productCategories),
  );

  jobIdAndName$ = this.formService.value$.pipe(
    map(job => this.jobIdAndName(job)),
  );

  customerProducts$ = this.formService.value$.pipe(
    map(value => value.customer),
    filter(customer => !!customer),
    distinctUntilChanged(),
    switchMap(customer => this.productsService.productsCustomer(customer)),
  );

  showPrices$: Observable<boolean> = this.loginService.isModule('calculations');

  get updateFolderLocation(): boolean {
    return this.folderPathComponent.updatePath;
  }

  get nameControl() {
    return this.formService.form.controls.name;
  }


  get isNew(): boolean {
    return !this.formService.value.jobId;
  }

  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private productsService: ProductsService,
    private customersService: CustomersService,
    private sanitize: SanitizeService,
    private loginService: LoginService,
    private formService: JobFormService,
  ) { }

  ngOnInit(): void {
  }


  private jobIdAndName(job: Partial<Job>) {
    const name = this.sanitize.sanitizeFileName(job.name);
    return `${job.jobId}-${name}`;
  }


}
