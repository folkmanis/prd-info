import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ClassTransformer } from 'class-transformer';
import { isEqual, pickBy } from 'lodash-es';
import { Observable, map, of, tap } from 'rxjs';
import { Customer, CustomerContact, CustomerFinancial, FtpUserData, NewCustomer } from 'src/app/interfaces';
import { CustomersService } from 'src/app/services';


@Injectable()
export class CustomerFormService {

  private initialValue: Customer | null = null;

  form = this.createForm();

  updateChanges = this.form.valueChanges.pipe(
    map(() => this.changes),
  );

  get isNew(): boolean {
    return !this.initialValue?._id;
  }

  get value() {
    return this.transformer.plainToInstance(Customer, this.form.value, { exposeDefaultValues: true });
  }


  get changes(): Partial<Customer> | undefined {
    if (this.isNew) {
      return pickBy(this.value, value => value !== null);
    } else {
      const diff = pickBy(this.value, (value, key) => !isEqual(value, this.initialValue[key]));
      return Object.keys(diff).length ? diff : undefined;
    }
  }


  constructor(
    private customersService: CustomersService,
    private transformer: ClassTransformer,
  ) { }

  setInitial(value: Customer | null) {
    if (value._id) {
      this.initialValue = value;
    } else {
      this.initialValue = new Customer();
    }
    this.form.reset(this.initialValue);
  }

  reset(): void {
    this.form.reset(this.initialValue);
  }

  save(): Observable<Customer> {
    if (this.isNew) {
      const customer = pickBy(this.value, value => value !== null) as NewCustomer;
      return this.customersService.saveNewCustomer(customer).pipe(
        tap(() => this.form.markAsPristine()),
      );
    } else {
      const update = { ...this.changes, _id: this.value._id };
      return this.customersService.updateCustomer(update).pipe(
        tap(value => this.setInitial(value)),
      );
    }
  }

  private createForm() {

    return new FormGroup({
      _id: new FormControl<string>(null),
      CustomerName: new FormControl(
        '',
        [Validators.required, Validators.minLength(3)],
        [this.validateName()]
      ),
      code: new FormControl(
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(3)],
        [this.validateCode()]
      ),
      disabled: new FormControl<boolean>(false, { nonNullable: true }),
      description: new FormControl<string>(''),
      financial: new FormControl<CustomerFinancial>(null),
      ftpUser: new FormControl<boolean>(false, { nonNullable: true }),
      ftpUserData: new FormControl<FtpUserData>(null),
      contacts: new FormControl<CustomerContact[]>([]),
      insertedFromXmf: new FormControl<Date>(null),
    });

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
      if (this.initialValue?.CustomerName === control.value) {
        return of(null);
      } else {
        return this.customersService.validator('CustomerName', control.value).pipe(
          map(val => val ? null : { occupied: control.value })
        );
      }
    };
  };



}
