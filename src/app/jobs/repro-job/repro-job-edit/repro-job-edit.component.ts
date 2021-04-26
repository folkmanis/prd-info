import { ChangeDetectionStrategy, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { endOfWeek, startOfWeek } from 'date-fns';
import { EMPTY, merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, switchMap } from 'rxjs/operators';
import { CustomerPartial, CustomerProduct, JobBase, SystemPreferences } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { CustomersService, ProductsService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';
import { JobService } from 'src/app/services/job.service';
import { FileUploadService } from '../../services/file-upload.service';
import { JobFormSource } from '../services/job-form-source';
import { ReproJobResolverService } from '../services/repro-job-resolver.service';
import { CustomerInputComponent } from './customer-input/customer-input.component';
import { ReproProductsEditorComponent } from './repro-products-editor/repro-products-editor.component';
import { JobFormService } from '../services/job-form.service';


@Component({
  selector: 'app-repro-job-edit',
  templateUrl: './repro-job-edit.component.html',
  styleUrls: ['./repro-job-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReproJobEditComponent implements OnInit, CanComponentDeactivate {

  @ViewChild(CustomerInputComponent) customerInputElement: CustomerInputComponent;

  @ViewChild(ReproProductsEditorComponent) private productsEditor: ReproProductsEditorComponent;

  formSource = new JobFormSource(
    this.fb,
    this.jobFormService,
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
    private jobFormService: JobFormService,
  ) { }

  ngOnInit(): void {

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
    this.formSource.initValue(data);
    if (!data.customer) {
      setTimeout(() => this.customerInputElement.focus(), 200);
    }
  }

  /** Ctrl-+ event */
  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key === '+' && event.ctrlKey) {
      event.preventDefault();
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
      this.formSource.folderPath$.next(files.path?.join('/'));
    });
  }

  onRemoveProduct(idx: number) {
    this.formSource.removeProduct(idx);
  }

  onAddProduct() {
    this.formSource.addProduct();
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
