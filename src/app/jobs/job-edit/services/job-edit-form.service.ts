import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { EMPTY, merge, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, shareReplay, switchMap, take, withLatestFrom } from 'rxjs/operators';
import { CustomerProduct, Job, JobBase, JobProduct } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services';
import { CustomersService } from 'src/app/services/customers.service';

export const DEFAULT_UNITS = 'gab.';

@Injectable()
export class JobEditFormService {
  fb: IFormBuilder;
  constructor(
    fb: FormBuilder,
    private customersService: CustomersService,
  ) { this.fb = fb; }

  /* Servisā pieejama arī forma un darba sākotnējie iestatījumi */
  jobForm: IFormGroup<JobBase>;
  private _job: Partial<JobBase>;
  private _customerProducts$: Observable<CustomerProduct[]> | undefined;

  jobFormBuilder(job?: Partial<Job>): IFormGroup<JobBase> {
    // const products = job?.products instanceof Array ? job.products.map(prod => this.productFormGroup(prod)) : [];
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
        products: [job?.products],
        files: this.fb.group({
          path: this.fb.control(job?.files?.path),
          fileNames: this.fb.array(job?.files?.fileNames || []),
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
