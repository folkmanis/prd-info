import { AbstractControl, AsyncValidatorFn, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { IFormBuilder, IFormControl, IFormGroup } from '@rxweb/types';
import { endOfDay } from 'date-fns';
import { EMPTY, Observable, of, BehaviorSubject } from 'rxjs';
import { concatMap, map, mergeMap, take, tap } from 'rxjs/operators';
import { CustomerProduct, Job, JobBase, JobProduct } from 'src/app/interfaces';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { CustomersService, ProductsService } from 'src/app/services';
import { JobService } from 'src/app/services/job.service';
import { FileUploadService } from '../../services/file-upload.service';

export class JobFormSource extends SimpleFormSource<JobBase> {

    folderPath$: BehaviorSubject<string> = new BehaviorSubject('');

    constructor(
        fb: FormBuilder,
        private customersService: CustomersService,
        private jobService: JobService,
        private fileUploadService: FileUploadService,
    ) {
        super(fb);
    }

    insertFn(job: JobBase): Observable<number> {
        const createFolder = !!this.fileUploadService.filesCount;
        return this.jobService.newJob(job, { createFolder }).pipe(
            tap(jobId => this.fileUploadService.startUpload(jobId)),
        );
    }

    updateFn(job: JobBase): Observable<JobBase> {
        job = {
            ...job,
            dueDate: endOfDay(new Date(job.dueDate)),
        };
        return this.jobService.updateJob(job).pipe(
            concatMap(resp => resp ? this.jobService.getJob(job.jobId) : EMPTY)
        );
    }

    get isNew(): boolean {
        return !this.form.value.jobId;
    }

    createForm(): IFormGroup<JobBase> {
        const jobForm: IFormGroup<JobBase> = this.fb.group<JobBase>(
            {
                jobId: [
                    undefined,
/*                     {
                        validators: Validators.required,
                    }
 */                ],
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
                category: [
                    undefined,
                    {
                        validators: Validators.required,
                    }
                ],
                comment: [undefined],
                customerJobId: [undefined],
                custCode: [{ value: undefined, disabled: true }],
                jobStatus: this.fb.group({
                    generalStatus: 10,
                }),
                products: [undefined],
                files: [undefined],
            });
        return jobForm;

    }

    initValue(value: Partial<JobBase>, params?: { emitEvent: boolean; }): void {
        super.initValue(value, params);
        if (value.invoiceId) {
            this.form.disable();
        }
        if (value.receivedDate) {
            this.form.get('receivedDate').disable({ emitEvent: false });
        }
        this.folderPath$.next(value.files?.path?.join('/') || '');
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
