import { FormGroup, FormControl, FormArray, FormBuilder, Validators, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { JobBase, JobProduct } from 'src/app/interfaces';
import { CustomersService, ProductsService } from 'src/app/services';
import { ProductFormGroup } from './product-form-group';
import { ProductFormArray } from './product-form-array';

const validateCustomerFn = (customersService: CustomersService): AsyncValidatorFn => {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        const value: string = control.value;
        return customersService.customers$.pipe(
            map(customers => customers.some(customer => customer.CustomerName === value)),
            map(cust => cust ? null : { noCustomer: `Klients ${value} nav atrasts` }),
            take(1),
        );
    };
};


export class JobFormGroup extends FormGroup {

    get jobValue(): JobBase {
        return this.value;
    }

    get products(): ProductFormArray {
        return this.get('products') as ProductFormArray;
    }

    get isNew(): boolean {
        return !this.value.jobId;
    }

    constructor(
        customersService: CustomersService,
        productsService: ProductsService,
        value: Partial<JobBase> = {},
    ) {
        super(
            {
                jobId: new FormControl(),
                customer: new FormControl('',
                    {
                        validators: Validators.required,
                        asyncValidators: validateCustomerFn(customersService),
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
                category: new FormControl(
                    undefined,
                    Validators.required,
                ),
                comment: new FormControl(undefined),
                customerJobId: new FormControl(undefined),
                custCode: new FormControl(undefined), // , { disabled: true }
                jobStatus: new FormGroup({
                    generalStatus: new FormControl(10),
                }),
                products: new ProductFormArray(productsService),
                files: new FormControl(undefined),
            }
        );
        this.patchValue(value);
    }

    patchValue(value: Partial<JobBase>, params: { emitEvent?: boolean; } = {}): void {
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
