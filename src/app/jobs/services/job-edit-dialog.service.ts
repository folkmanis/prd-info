import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, concatMap, switchMap, map, filter, take } from 'rxjs/operators';
import { Store, Select } from '@ngxs/store';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { Job, JobProduct } from 'src/app/interfaces';
import { JobDialogComponent } from '../job-edit/job-dialog.component';
import { JobEditDialogData } from '../job-edit/job-edit-dialog-data';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { CustomersService, ProductsService } from 'src/app/services';
import { JobsState } from '../store/jobs.state';
import { GetJob, UpdateJob, NewJob } from '../store/jobs.actions';

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
    private customersService: CustomersService,
    private productsService: ProductsService,
    private store: Store,
  ) { }

  products$ = this.productsService.products$;

  editJob(jobId: number): Observable<boolean> {

    return this.store.dispatch(new GetJob(jobId)).pipe(
      mergeMap(() => this.store.selectOnce(JobsState.job(jobId))),
    ).pipe(
      concatMap(job => this.dialog.open(JobDialogComponent, {
        ...JOB_DIALOG_CONFIG,
        data: {
          jobForm: this.jobFormBuilder(job),
        }
      }).afterClosed()),
      concatMap(job => job ? this.store.dispatch(new UpdateJob(jobId, job)) : of(false)),
    );
  }

  newJob(jobInit?: Partial<Job>): Observable<number | undefined> {
    const data: JobEditDialogData = {
      jobForm: this.jobFormBuilder(jobInit),
      jobCreateFn: this.jobCreatorFn(),
    };
    return this.dialog.open(JobDialogComponent, {
      ...JOB_DIALOG_CONFIG,
      autoFocus: true,
      data
    }).afterClosed().pipe(
      concatMap(job => !job?.jobId ? of(null) : this.store.dispatch(new UpdateJob(job.jobId, job)).pipe(
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
      jobStatus: this.fb.group({
        generalStatus: 10,
      }),
      products: this.fb.array(products),
    });
    this.setFormValues(jobForm, job);
    return jobForm;
  }

  private setFormValues(jobForm: FormGroup, job?: Partial<Job>): void {
    const enabled = !job || !job.invoiceId;
    if (!job) { return; }
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
    return (job) => this.store.dispatch(new NewJob(job)).pipe(
      map(() => this.store.selectSnapshot(JobsState.lastInsertId))
    );
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
