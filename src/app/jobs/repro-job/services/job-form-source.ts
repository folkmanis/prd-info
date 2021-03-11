import { AbstractControl, AsyncValidatorFn, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { endOfDay } from 'date-fns';
import { EMPTY, Observable, of } from 'rxjs';
import { concatMap, map, take } from 'rxjs/operators';
import { CustomerProduct, Job, JobBase, JobProduct } from 'src/app/interfaces';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { CustomersService, ProductsService } from 'src/app/services';
import { JobService } from 'src/app/services/job.service';

export class JobFormSource extends SimpleFormSource<JobBase> {

    constructor(
        fb: FormBuilder,
        private customersService: CustomersService,
        private jobService: JobService,
        // private productsService: ProductsService,
    ) {
        super(fb);
    }

    insertFn(job: JobBase): Observable<number> {
        console.log(job);

        return this.jobService.newJob(job);
    }

    updateFn(job: JobBase): Observable<JobBase> {
        console.log(job);
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
                category: [undefined],
                comment: [undefined],
                customerJobId: [undefined],
                custCode: [{ value: undefined, disabled: true }],
                jobStatus: this.fb.group({
                    generalStatus: 10,
                }),
                products: [undefined],
                files: this.fb.group({
                    path: this.fb.control(undefined),
                    fileNames: this.fb.array([]),
                })
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
