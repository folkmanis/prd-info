import { Component, OnInit, Input, Output, ViewChild, EventEmitter, Inject } from '@angular/core';
import { IFormArray, IFormControl, IFormGroup } from '@rxweb/types';
import { endOfWeek, startOfWeek } from 'date-fns';
import { merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, switchMap } from 'rxjs/operators';
import { CustomerPartial, CustomerProduct, JobBase, JobProduct, SystemPreferences } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { CONFIG } from 'src/app/services/config.provider';
import { CustomersService } from 'src/app/services/customers.service';
import { ProductsService } from 'src/app/services/products.service';
import { JobFormService } from '../../services/job-form.service';
import { ReproJobService } from '../../services/repro-job.service';
import { CustomerInputComponent } from '../customer-input/customer-input.component';
import { ReproProductsEditorComponent } from '../repro-products-editor/repro-products-editor.component';

@Component({
  selector: 'app-repro-job-form',
  templateUrl: './repro-job-form.component.html',
  styleUrls: ['./repro-job-form.component.scss']
})
export class ReproJobFormComponent implements OnInit {

  @ViewChild(CustomerInputComponent) customerInput: CustomerInputComponent;
  @ViewChild(ReproProductsEditorComponent) private productsEditor: ReproProductsEditorComponent;

  @Input('jobForm') form: IFormGroup<JobBase>;

  large$: Observable<boolean> = this.layoutService.isLarge$;

  receivedDate = {
    min: startOfWeek(Date.now()),
    max: endOfWeek(Date.now()),
  };

  get isNew(): boolean {
    return !this.form.value.jobId;
  }

  get customerControl(): IFormControl<string> {
    return this.form.get('customer') as unknown as IFormControl<string>;
  }
  get nameControl() { return this.form.get('name'); }
  get productsControl() { return this.form.get('products'); }

  jobStates$ = this.config$.pipe(
    pluck('jobs', 'jobStates'),
    map(states => states.filter(st => st.state < 50))
  );
  categories$ = this.config$.pipe(
    pluck('jobs', 'productCategories'),
  );
  folderPath$ = this.jobFormService.folderPath$;
  customers$: Observable<CustomerPartial[]> = this.customersService.customers$;
  customerProducts$: Observable<CustomerProduct[]>;


  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private clipboard: ClipboardService,
    private layoutService: LayoutService,
    private jobFormService: JobFormService,
    private reproJobService: ReproJobService,
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

  }

  copyJobIdAndName() {
    this.clipboard.copy(`${this.form.value.jobId}-${this.form.value.name}`);
  }

  isProductsSet(): boolean {
    return this.customerControl.valid || (this.productsControl.value instanceof Array && this.productsControl.value.length > 0);
  }

  onRemoveProduct(idx: number) {
    this.jobFormService.removeProduct(this.form.controls.products as IFormArray<JobProduct>, idx);
  }

  onAddProduct() {
    this.jobFormService.addProduct(this.form.controls.products as IFormArray<JobProduct>);
    setTimeout(() => this.productsEditor.focusLatest(), 0);
  }

  onCreateFolder() {
    this.reproJobService.createFolder(this.form.value.jobId).pipe(
      pluck('files'),
    ).subscribe(files => {
      this.form.controls.files.setValue(files);
      this.jobFormService.folderPath$.next(files.path?.join('/'));
    });
  }




}
