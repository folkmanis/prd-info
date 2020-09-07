import { Injectable } from '@angular/core';
import { Job, JobProduct } from 'src/app/interfaces';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors, AbstractControlOptions } from '@angular/forms';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { CustomersService } from 'src/app/services/customers.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'any'
})
export class JobEditFormService {

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
  ) { }

  jobFormBuilder(job?: Partial<Job>): FormGroup {
    const products = job?.products instanceof Array ? job.products.map(prod => this.productFormGroup(prod)) : [];
    const jobControls: { [P in keyof Job]?: [any?, AbstractControlOptions?] | AbstractControl } = {
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
      comment: [],
      customerJobId: [],
      jobStatus: this.fb.group({
        generalStatus: 10,
      }),
      products: this.fb.array(products),
    };
    const jobForm = this.fb.group(jobControls);

    this.setFormValues(jobForm, job);
    return jobForm;
  }

  private setFormValues(jobForm: FormGroup, job?: Partial<Job>): void {
    if (!job) { return; }
    jobForm.patchValue(job, { emitEvent: false });
    if (job.invoiceId) {
      jobForm.disable();
    }
    if (job.receivedDate) {
      jobForm.get('receivedDate').disable({ emitEvent: false });
    }
  }


  productFormGroup(product?: Partial<JobProduct>, enabled = true): FormGroup {
    const _group = this.fb.group({
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
