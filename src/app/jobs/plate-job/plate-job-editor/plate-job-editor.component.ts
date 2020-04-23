import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { FormControl, FormBuilder, AbstractControl, AsyncValidatorFn, ValidationErrors, Validators, FormGroup, FormArray } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { tap, map, startWith } from 'rxjs/operators';
import { ProductsService, CustomersService } from '../../services';
import { Customer, CustomerPartial } from '../../services/customer';
import { Job, JobProduct } from '../../services/job';

@Component({
  selector: 'app-plate-job-editor',
  templateUrl: './plate-job-editor.component.html',
  styleUrls: ['./plate-job-editor.component.css']
})
export class PlateJobEditorComponent implements OnInit {
  @ViewChild('customerInput', { read: MatInput, static: true }) customerInput: MatInput;
  @Input('job') set activeJob(_job: Job | undefined) {
    this.job = _job;
    this.setFormValues(_job);
  }
  @Output() private jobChanges: EventEmitter<Partial<Job>> = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) { }

  job: Job | undefined;
  jobForm = this.fb.group({
    customer: [
      '',
      {
        validators: Validators.required,
        asyncValidators: this.validateCustomerFn(),
      },
    ],
    name: [
      undefined,
      {
        validators: Validators.required,
      },
    ],
    comment: [],
    customerJobId: [],
    products: this.fb.array([]),
  });
  get customerControl(): FormControl { return this.jobForm.get('customer') as FormControl; }
  get nameControl(): FormControl { return this.jobForm.get('name') as FormControl; }
  get productsControl(): FormArray { return this.jobForm.get('products') as FormArray; }

  customers$: Observable<CustomerPartial[]> = combineLatest([
    this.customersService.customers$,
    this.customerControl.valueChanges.pipe(
      startWith(''),
    ),
  ]).pipe(
    map(this.filterCustomer)
  );

  ngOnInit(): void {
  }

  onSave() {
    this.jobForm.markAsPristine();
    this.jobChanges.next(this.jobForm.value);
  }

  private filterCustomer([customers, value]: [CustomerPartial[], string]): CustomerPartial[] {
    const filterValue: string = value.toLowerCase();
    return customers.filter(state => state.CustomerName.toLowerCase().indexOf(filterValue) === 0);
  }

  private validateCustomerFn(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;
      return this.customersService.customers$.pipe(
        map(customers =>
          customers.some(customer => customer.CustomerName === value) ? null : { noCustomer: `Klients ${value} nav atrasts` }
        ),
      );
    };
  }

  private setFormValues(job: Job | undefined): void {
    this.jobForm.reset({ customer: '' });
    this.jobForm.setControl('products', this.setProductForm(job));
    if (job) {
      this.jobForm.patchValue(job, { emitEvent: false });
    } else {
      setTimeout(() => this.customerInput.focus(), 0);
    }
  }

  private setProductForm(job: Job): FormArray {
    const productsForm: FormGroup[] = [];
    if (job && job.products) {
      for (const product of job.products) {
        productsForm.push(
          this.fb.group({
            name: [product.name],
            price: [product.price || ''],
            count: [product.count || 0],
            comment: [product.comment],
          })
        );
      }
    }
    return this.fb.array(productsForm);
  }

}
