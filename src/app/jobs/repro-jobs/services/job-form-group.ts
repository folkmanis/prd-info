import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
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

    constructor(
        customers$: Observable<CustomerPartial[]>,
        products$: Observable<ProductPartial[]>,
        value: Partial<Job> = {},
    ) {
        super(
            {
                jobId: new FormControl(),
                customer: new FormControl('',
                    {
                        validators: Validators.required,
                        asyncValidators: validateCustomerFn(customers$),
                    },
                ),
                name: new FormControl(
                    undefined,
                    {
                        validators: Validators.required,
                    },

                ),
                receivedDate: new FormControl(
                    new Date(),
                    Validators.required,
                ),
                dueDate: new FormControl(
                    new Date(),
                    Validators.required,
                ),
                production: new FormGroup({
                    category: new FormControl(
                        undefined,
                        Validators.required,
                    ),
                }),
                comment: new FormControl(undefined),
                customerJobId: new FormControl(undefined),
                jobStatus: new FormGroup({
                    generalStatus: new FormControl(10),
                    timestamp: new FormControl(),
                }),
                products: new ProductFormArray(products$),
                files: new FormControl(undefined),
            }
        );
        this.patchValue(value);
    }

    patchValue(value: Partial<Job>, params: { emitEvent?: boolean; } = {}): void {
        this.products.setProductControls((value.products as JobProduct[])?.length || 0);
        this.reset(undefined, params);
        super.patchValue(value, params);
        this.markAsPristine();

        if (value.invoiceId) {
            this.disable({ emitEvent: false });
        } else {
            this.enable({ emitEvent: false });
        }
        if (value.jobId !== undefined) {
            this.get('receivedDate').disable({ emitEvent: false });
        }
        this.markAsPristine();
    }


}
