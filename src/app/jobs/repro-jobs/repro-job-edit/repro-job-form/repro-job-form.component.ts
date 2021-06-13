import { Component, OnInit, Input, Output, ViewChild, EventEmitter, Inject, ChangeDetectionStrategy } from '@angular/core';
import { addDays, subDays, endOfWeek, startOfWeek } from 'date-fns';
import { EMPTY, merge, Observable, of, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, startWith, switchMap } from 'rxjs/operators';
import { CustomerPartial, CustomerProduct, JobBase, JobProduct, SystemPreferences } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { CONFIG } from 'src/app/services/config.provider';
import { CustomersService } from 'src/app/services/customers.service';
import { JobService } from 'src/app/services/job.service';
import { ProductsService } from 'src/app/services/products.service';
import { CustomerInputComponent } from '../customer-input/customer-input.component';
import { ReproProductsEditorComponent } from '../repro-products-editor/repro-products-editor.component';
import { log } from 'prd-cdk';
import { JobFormGroup } from '../../services/job-form-group';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'app-repro-job-form',
  templateUrl: './repro-job-form.component.html',
  styleUrls: ['./repro-job-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReproJobFormComponent implements OnInit {

  @ViewChild(CustomerInputComponent) customerInput: CustomerInputComponent;
  @ViewChild(ReproProductsEditorComponent) private productsEditor: ReproProductsEditorComponent;

  @Input('jobForm') form: JobFormGroup;

  large$: Observable<boolean> = this.layoutService.isLarge$;

  receivedDate = {
    min: subDays(Date.now(), 5),
    max: addDays(Date.now(), 3),
  };

  get customerControl(): FormControl {
    return this.form.get('customer') as FormControl;
  }
  get nameControl() {
    return this.form.get('name') as FormControl;
  }
  get productsControl() {
    return this.form.products;
  }

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


  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private clipboard: ClipboardService,
    private layoutService: LayoutService,
    private jobsService: JobService,
    private customersService: CustomersService,
    private productsService: ProductsService,
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

    this.folderPath$ = this.form.valueChanges.pipe(
      startWith(this.form.value),
      pluck('files'),
      map(files => files?.path?.join('/'))
    );

  }

  copyJobIdAndName() {
    this.clipboard.copy(`${this.form.value.jobId}-${this.form.value.name}`);
  }

  isProductsSet(): boolean {
    return this.customerControl.valid || (this.productsControl.value instanceof Array && this.productsControl.value.length > 0);
  }

  onRemoveProduct(idx: number) {
    this.form.products.removeProduct(idx);
  }

  onAddProduct() {
    this.form.products.addProduct();
    setTimeout(() => this.productsEditor.focusLatest(), 0);
  }

  onCreateFolder() {
    const jobId = this.form.value.jobId;
    this.jobsService.updateJob({ jobId }, { createFolder: true }).pipe(
      switchMap(resp => resp ? this.jobsService.getJob(jobId) : EMPTY),
      pluck('files'),
    ).subscribe(files => {
      this.form.controls.files.setValue(files);
    });
  }


}
