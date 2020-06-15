import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, concatMap, switchMap, map, filter, take } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Job, JobProduct } from 'src/app/interfaces';
import { JobDialogComponent } from '../job-edit/job-dialog.component';
import { JobService } from '../services/job.service';
import { JobEditDialogData } from '../job-edit/job-edit-dialog-data';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { CustomersService, ProductsService } from 'src/app/services';

const JOB_DIALOG_CONFIG: MatDialogConfig = {
  height: '90%',
  width: '90%',
  autoFocus: false,
  data: {},
};

@Injectable()
export class JobEditDialogService {

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private jobService: JobService,
    private customersService: CustomersService,
    private productsService: ProductsService,
  ) { }

  products$ = this.productsService.products$;

  editJob(jobId: number) {
    this.jobService.getJob(jobId).pipe(
      concatMap(job => this.dialog.open(JobDialogComponent, {
        ...JOB_DIALOG_CONFIG,
        data: {
          jobForm: this.jobFormBuilder(job),
        }
      }).afterClosed()),
      filter(job => !!job),
      map((job: Partial<Job>) => ({ ...job, jobId })),
      concatMap(job => this.jobService.updateJob(job)),
    )
      .subscribe(result => console.log(result));
  }

  newJob(jobInit?: Partial<Job>): Observable<number | undefined> {
    const data: JobEditDialogData = {
      jobForm: this.jobFormBuilder(jobInit),
      jobCreateFn: this.jobCreatorFn(),
    };
    return this.dialog.open(JobDialogComponent, {
      ...JOB_DIALOG_CONFIG,
      data
    }).afterClosed().pipe(
      concatMap(job => !job?.jobId ? of(null) : this.jobService.updateJob(job).pipe(
        map(() => job.jobId)
      )),
    );
  }

  private jobFormBuilder(job?: Partial<Job>): FormGroup {
    const products = job?.products instanceof Array ? job.products.map(prod => this.productFormGroup(prod)) : [];
    const jobForm = this.fb.group({
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
      comment: [],
      customerJobId: [],
      products: this.fb.array(products),
    });
    this.setFormValues(jobForm, job);
    return jobForm;
  }

  private setFormValues(jobForm: FormGroup, job?: Partial<Job>): void {
    const enabled = !job || !job.invoiceId;
    if (!job) { return; }
    jobForm.reset({ customer: '' });
    jobForm.patchValue(job, { emitEvent: false });
    if (enabled) { jobForm.enable(); } else { jobForm.disable(); }
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


  private jobCreatorFn(): ((job: Partial<Job>) => Observable<number | null>) {
    return (job) => this.jobService.newJob(job);
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
