import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { IFormArray, IFormControl, IFormGroup } from '@rxweb/types';
import { endOfWeek, startOfWeek } from 'date-fns';
import { EMPTY, merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, subscribeOn, switchMap } from 'rxjs/operators';
import { CustomerPartial, CustomerProduct, JobBase, JobProduct, SystemPreferences } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { CustomersService, ProductsService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { JobService } from 'src/app/services/job.service';
import { ReproJobResolverService } from '../services/repro-job-resolver.service';
import { CustomerInputComponent } from './customer-input/customer-input.component';
import { ReproProductsEditorComponent } from './repro-products-editor/repro-products-editor.component';
import { JobFormService } from '../services/job-form.service';
import { LoginService } from 'src/app/services/login.service';
import { ReproJobService } from '../services/repro-job.service';
import { log } from 'prd-cdk';


@Component({
  selector: 'app-repro-job-edit',
  templateUrl: './repro-job-edit.component.html',
  styleUrls: ['./repro-job-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReproJobEditComponent implements OnInit, CanComponentDeactivate {
  @ViewChild(CustomerInputComponent) customerInputElement: CustomerInputComponent;
  @ViewChild(ReproProductsEditorComponent) private productsEditor: ReproProductsEditorComponent;

  form: IFormGroup<JobBase> = this.jobFormService.createJobForm();

  get customerControl(): IFormControl<string> {
    return this.form.get('customer') as unknown as IFormControl<string>;
  }
  get nameControl() { return this.form.get('name'); }
  get productsControl() { return this.form.get('products'); }

  get isNew(): boolean {
    return !this.form.value.jobId;
  }

  folderPath$ = this.jobFormService.folderPath$;

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

  showPrice$: Observable<boolean> = this.loginService.isModule('calculations');

  constructor(
    private customersService: CustomersService,
    private jobService: JobService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private clipboard: ClipboardService,
    private layoutService: LayoutService,
    private productsService: ProductsService,
    private resolver: ReproJobResolverService,
    private jobFormService: JobFormService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private reproJobService: ReproJobService,
  ) { }

  ngOnInit(): void {

    this.route.data.pipe(
      pluck('job'),
    ).subscribe(job => this.onDataChange(job));

    this.customerProducts$ = merge(
      this.form.valueChanges,
      of(this.form.value)
    ).pipe(
      pluck('customer'),
      filter(customer => !!customer),
      distinctUntilChanged(),
      switchMap(customer => this.productsService.productsCustomer(customer)),
    );

  }

  onDataChange(data: Partial<JobBase>) {
    data = this.setNewJobDefaults(data);
    this.jobFormService.initValue(this.form, data);
    if (!data.customer) {
      setTimeout(() => this.customerInputElement.focus(), 200);
    }
  }

  /** Ctrl-+ event */
  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key === '+' && event.ctrlKey) {
      event.preventDefault();
      event.stopPropagation();
      this.onAddProduct();
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
      this.jobFormService.folderPath$.next(files.path?.join('/'));
    });
  }

  onRemoveProduct(idx: number) {
    this.jobFormService.removeProduct(this.form.controls.products as IFormArray<JobProduct>, idx);
  }

  onAddProduct() {
    this.jobFormService.addProduct(this.form.controls.products as IFormArray<JobProduct>);
    setTimeout(() => this.productsEditor.focusLatest(), 0);
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
