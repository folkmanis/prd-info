import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { log } from 'prd-cdk';
import { Observable } from 'rxjs';
import { map, share, shareReplay, startWith, take } from 'rxjs/operators';
import { CustomerPartial, ProductPartial } from 'src/app/interfaces';
import { Job, JobProduct } from '../../interfaces';
import { ProductFormArray } from './product-form-array';

const validateCustomerFn = (customers$: Observable<CustomerPartial[]>): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const value: string = control.value;
        return customers$.pipe(
            map(customers => customers.some(customer => customer.CustomerName === value)),
            map(cust => cust ? null : { noCustomer: `Klients ${value} nav atrasts` }),
            take(1),
        );
    };
};


export class JobFormGroup extends FormGroup {

    get jobValue(): Job {
        return this.value;
    }

    get products(): ProductFormArray {
        return this.get('products') as ProductFormArray;
    }

    get isNew(): boolean {
        return !this.value.jobId;
    }

    value$: Observable<Job> = this.valueChanges.pipe(
        startWith(this.jobValue),
        shareReplay(1),
    );

    constructor(
        customers$: Observable<CustomerPartial[]>,
        products$: Observable<ProductPartial[]>,
        value: Partial<Job> = {},
    ) {
        super(
            {
                jobId: new FormControl(value.jobId),
                customer: new FormControl(
                    value.customer,
                    {
                        validators: Validators.required,
                        asyncValidators: validateCustomerFn(customers$),
                    },
                ),
                name: new FormControl(
                    value.name,
                    {
                        validators: Validators.required,
                    },

                ),
                receivedDate: new FormControl(
                    new Date(value.receivedDate),
                    Validators.required,
                ),
                dueDate: new FormControl(
                    new Date(value.dueDate),
                    Validators.required,
                ),
                production: new FormGroup({
                    category: new FormControl(
                        value.production?.category,
                        Validators.required,
                    ),
                }),
                comment: new FormControl(value.comment),
                customerJobId: new FormControl(value.customerJobId),
                jobStatus: new FormGroup({
                    generalStatus: new FormControl(value.jobStatus?.generalStatus || 10),
                    timestamp: new FormControl(value.jobStatus?.timestamp || new Date()),
                }),
                products: new ProductFormArray(value.products),
                files: new FormControl(value.files),
            }
        );

        if (value.invoiceId) {
            this.disable({ emitEvent: false });
        } else {
            this.enable({ emitEvent: false });
        }
        if (value.jobId !== undefined) {
            this.get('receivedDate').disable({ emitEvent: false });
        }

    }


}
