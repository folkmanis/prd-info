import { Customer, NewCustomer } from 'src/app/interfaces';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CustomersService } from 'src/app/services';
import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SimpleFormSource } from 'src/app/library/simple-form';

export class CustomersFormSource extends SimpleFormSource<Customer> {

    private customer?: Partial<Customer>;

    constructor(
        fb: FormBuilder,
        private customersService: CustomersService,
    ) {
        super(fb);
    }

    createForm(): IFormGroup<Customer> {
        return this.fb.group<Customer>({
            _id: [undefined],
            CustomerName: [''],
            code: [
                '', {
                    validators: [Validators.required, Validators.minLength(2), Validators.maxLength(3)],
                    asyncValidators: this.validateCode()
                }
            ],
            disabled: [false],
            description: [''],
            financial: [undefined],
        });
    }

    get isNew(): boolean {
        return !this.value._id;
    }

    initValue(customer: Partial<Customer>) {
        this.customer = customer;
        if (customer._id) {
            this.form.controls.CustomerName.setAsyncValidators([]);
        } else {
            this.form.controls.CustomerName.setAsyncValidators([this.validateName()]);
        }
        super.initValue(customer);
    }

    updateFn(val: Customer): Observable<Customer> {
        return this.customersService.updateCustomer(val).pipe(
            mergeMap(resp => resp ? this.customersService.getCustomer(val._id) : EMPTY)
        );
    }

    insertFn(val: NewCustomer): Observable<string> {
        return this.customersService.saveNewCustomer(val);
    }

    private validateCode(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.customer?.code === control.value ? of(null) : this.customersService.validator('code', control.value).pipe(
                map(val => val ? null : { occupied: control.value })
            );
        };
    }

    private validateName(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.customersService.validator('CustomerName', control.value).pipe(
                map(val => val ? null : { occupied: control.value })
            );
        };
    }


}
