import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { IFormGroup } from '@rxweb/types';
import { defaults, pickBy } from 'lodash';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Customer, DEFAULT_CUSTOMER, NewCustomer } from 'src/app/interfaces';
import { SimpleFormSource } from 'src/app/library/simple-form';
import { CustomersService } from 'src/app/services';

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
            ftpUser: [false],
            ftpUserData: [undefined],
            email: [undefined],
        });
    }

    initValue(customer: Partial<Customer>) {
        if (customer._id) {
            this.form.controls.CustomerName.setAsyncValidators([]);
        } else {
            this.form.controls.CustomerName.setAsyncValidators([this.validateName()]);
        }
        this.setFtpUserDisabledState(customer.ftpUser, { emitEvent: false });
        super.initValue(defaults(customer, DEFAULT_CUSTOMER));
    }

    updateEntity(): Observable<Customer> {
        const update = { ...this.changes, _id: this.value._id };
        return this.customersService.updateCustomer(update);
    }

    createEntity(): Observable<string> {
        const customer = pickBy(this.value, value => value !== null) as NewCustomer;
        return this.customersService.saveNewCustomer(customer);
    }

    setFtpUserDisabledState(state: boolean, options?: { emitEvent: boolean; }): void {
        const control = this.form.get('ftpUserData');
        if (state) {
            control.enable(options);
        } else {
            control.disable(options);
        }
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
