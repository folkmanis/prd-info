import { Injectable } from '@angular/core';
import { Job, JobProduct, JobBase, CustomerProduct } from 'src/app/interfaces';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors, AbstractControlOptions, ValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { CustomersService } from 'src/app/services/customers.service';
import { IFormBuilder, IFormGroup, IFormControl } from '@rxweb/types';

@Injectable({
  providedIn: 'any'
})
export class JobEditFormService {
  fb: IFormBuilder;
  constructor(
    fb: FormBuilder,
    private customersService: CustomersService,
  ) { this.fb = fb; }

  jobFormBuilder(job?: Partial<Job>): IFormGroup<JobBase> {
    const products = job?.products instanceof Array ? job.products.map(prod => this.productFormGroup(prod)) : [];
    const jobForm: IFormGroup<JobBase> = this.fb.group<JobBase>(
      {
        jobId: [
          undefined,
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
        custCode: [undefined],
        jobStatus: this.fb.group({
          generalStatus: 10,
        }),
        products: this.fb.array<JobProduct>(products),
        files: this.fb.group({
          path: this.fb.array(job?.files?.path || []),
        })
      }
    );

    this.setFormValues(jobForm, job);
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
