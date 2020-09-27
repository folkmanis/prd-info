import { Injectable } from '@angular/core';
import { Job, JobProduct, JobBase, CustomerProduct } from 'src/app/interfaces';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors, AbstractControlOptions, ValidatorFn } from '@angular/forms';
import { Observable, EMPTY, of, combineLatest, merge } from 'rxjs';
import { take, map, startWith, filter, distinctUntilChanged, switchMap, shareReplay, tap, debounceTime, withLatestFrom } from 'rxjs/operators';
import { CustomersService } from 'src/app/services/customers.service';
import { IFormBuilder, IFormGroup, IFormControl } from '@rxweb/types';
import { ProductsService } from 'src/app/services';

@Injectable()
export class JobEditFormService {
  fb: IFormBuilder;
  constructor(
    fb: FormBuilder,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) { this.fb = fb; }

  /* Servisā pieejama arī forma un darba sākotnējie iestatījumi */
  jobForm: IFormGroup<JobBase>;
  private _job: Partial<JobBase>;
  private _customerProducts$: Observable<CustomerProduct[]> | undefined;

  get job$(): Observable<JobBase> {
    if (!this.jobForm || !this._job) { return EMPTY; }
    return merge(
      this.jobForm.valueChanges,
      of(this.jobForm.value)
    ).pipe(
      map(jobFrm => ({ ...this._job, ...jobFrm })),
      debounceTime(200),
      withLatestFrom(this.customersService.customers$),
      map(([job, customers]) => ({ ...job, custCode: customers.find(cust => cust.CustomerName === job.customer)?.code })),
    );
  }

  get customerProducts$(): Observable<CustomerProduct[]> {
    if (!this._customerProducts$) {
      this._customerProducts$ = this.job$.pipe(
        map(job => job?.customer),
        distinctUntilChanged(),
        switchMap(customer => this.productsService.productsCustomer(customer || 'NULL')),
        shareReplay(1),
      );
    }
    return this._customerProducts$;
  }


  jobFormBuilder(job?: Partial<Job>): IFormGroup<JobBase> {
    const products = job?.products instanceof Array ? job.products.map(prod => this.productFormGroup(prod)) : [];
    const jobForm: IFormGroup<JobBase> = this.fb.group<JobBase>(
      {
        jobId: [
          undefined,
          {
            validators: Validators.required,
          }
        ],
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
        receivedDate: [
          new Date(),
          {
            validators: Validators.required,
          }
        ],
        dueDate: [
          new Date(),
          {
            validators: Validators.required,
          }
        ],
        category: [undefined],
        comment: [undefined],
        customerJobId: [undefined],
        custCode: [{ value: undefined, disabled: true }],
        jobStatus: this.fb.group({
          generalStatus: 10,
        }),
        products: this.fb.array<JobProduct>(products),
        files: this.fb.group({
          path: this.fb.control(job?.files?.path),
        })
      }
    );

    this.setFormValues(jobForm, job);
    this.jobForm = jobForm;
    this._job = job;
    return jobForm;
  }

  private setFormValues(jobForm: IFormGroup<JobBase>, job?: Partial<JobBase>): void {
    if (!job) { return; }
    jobForm.patchValue(job, { emitEvent: false });
    if (job.invoiceId) {
      jobForm.disable();
    }
    if (job.receivedDate) {
      jobForm.get('receivedDate').disable({ emitEvent: false });
    }
  }


  productFormGroup(product?: Partial<JobProduct>, enabled = true): IFormGroup<JobProduct> {
    const _group = this.fb.group<JobProduct>({
      name: [
        product?.name,
        {
          validators: [Validators.required],
        }
      ],
      price: [
        product?.price,
        {
          validators: [Validators.min(0)],
        }
      ],
      count: [
        product?.count || 0,
        {
          validators: [Validators.min(0)],
        }
      ],
      comment: [product?.comment],
    });
    enabled ? _group.enable() : _group.disable();
    return _group;
  }

  setProductGroupValidators(gr: IFormGroup<JobProduct>, prod: CustomerProduct[]) {
    gr.controls.name.setValidators([Validators.required, this.productValidatorFn(prod)]);
    gr.setValidators([this.defaultPriceValidatorFn(prod)]);
  }

  private defaultPriceValidatorFn(prod: CustomerProduct[]): ValidatorFn {
    let prevVal: JobProduct | undefined;
    return (control: IFormGroup<JobProduct>): null | ValidationErrors => {
      if (!control.controls.name.valid) {
        return null;
      }
      /* ja pirmoreiz, vai mainās produkta nosaukums */
      if ((prevVal === undefined || prevVal.name !== control.value.name)) {
        const prodPrice = prod?.find(product => product.productName === control.value.name)?.price;
        /* un ja ir atrasta cena */
        if (prodPrice) {
          prevVal = { ...control.value, price: prodPrice }; // saglabā uzstādīto produktu
          control.controls.price.setValue(prodPrice); // un nomaina cenu ievades laukā
        }
      }
      return null;
    };

  }

  private productValidatorFn(prod: CustomerProduct[]): ValidatorFn {
    return (control: IFormControl<string>): null | ValidationErrors =>
      prod.some(product => product.productName === control.value) ? null : { invalidProduct: 'Prece nav atrasta katalogā' };
  }



  private validateCustomerFn(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const value = control.value;
      return this.customersService.customers$.pipe(
        map(customers =>
          customers.some(customer => customer.CustomerName === value) ? null : { noCustomer: `Klients ${value} nav atrasts` }
        ),
        take(1),
      );
    };
  }

}
