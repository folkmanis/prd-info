import { Injectable } from '@angular/core';
import { Customer, NewCustomer, DEFAULT_CUSTOMER } from 'src/app/interfaces';
import { IFormBuilder, IFormGroup } from '@rxweb/types';
import { FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CustomersService } from 'src/app/services';
import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { defaults, pickBy } from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class CustomersFormSource extends SimpleFormSource<Customer> {

    constructor(
        fb: FormBuilder,
        private customersService: CustomersService,
    ) {
        super(fb);
    }

    get isNew(): boolean {
        return !this.value._id;
    }

    createForm(): IFormGroup<Customer> {
        return this.fb.group<Customer>({
            _id: [undefined],
            CustomerName: [
                '',
                {
                    validators: [Validators.required, Validators.minLength(3)],
                }
            ],
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

    initValue(customer: Partial<Customer>) {
        if (customer._id) {
            this.form.controls.CustomerName.setAsyncValidators([]);
        } else {
            this.form.controls.CustomerName.setAsyncValidators([this.validateName()]);
        }
        super.initValue(defaults(customer, DEFAULT_CUSTOMER));
    }

    updateEntity(): Observable<Customer> {
        const update = { ...this.changes, _id: this.value._id };
        return this.customersService.updateCustomer(update);
    }

    createEntity(): Observable<string> {
        const customer = pickBy(this.value, value => value !== null) as NewCustomer; // defaults(this.value, DEFAULT_CUSTOMER);
        return this.customersService.saveNewCustomer(customer);
    }

    private validateCode(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            if (this.initialValue?.code === control.value) {
                return of(null);
            } else {
                return this.customersService.validator('code', control.value).pipe(
                    map(val => val ? null : { occupied: control.value })
                );
            }
        };
    }

    private validateName(): AsyncValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return this.customersService.validator('CustomerName', control.value).pipe(
                map(val => val ? null : { occupied: control.value })
            );
        };
    };


}
