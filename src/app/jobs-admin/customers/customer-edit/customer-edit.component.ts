import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Observable, map, pluck, of } from 'rxjs';
import { Customer, DEFAULT_CUSTOMER, CustomerContact, CustomerFinancial, FtpUserData, SystemPreferences, NewCustomer } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { CONFIG } from 'src/app/services/config.provider';
import { CustomersFormSource } from '../services/customers-form-source';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SimpleFormTypedControl } from 'src/app/library/simple-form-typed';
import { defaults, isEqual, pickBy } from 'lodash';
import { CustomersService } from 'src/app/services';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: SimpleFormTypedControl, useExisting: CustomerEditComponent },
  ],
})
export class CustomerEditComponent implements OnInit, CanComponentDeactivate, SimpleFormTypedControl<Customer> {

  @ViewChild('paytraqPanel') paytraqPanel: MatExpansionPanel;

  readonly paytraqDisabled$ = this.config$.pipe(
    pluck('paytraq', 'enabled'),
    map(enabled => !enabled),
  );

  initialValue: Customer | null = null;

  form = new FormGroup({
    _id: new FormControl<string>(null),
    CustomerName: new FormControl(
      '',
      [Validators.required, Validators.minLength(3)],
    ),
    code: new FormControl(
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(3)],
      this.validateCode()
    ),
    disabled: new FormControl(false),
    description: new FormControl(''),
    financial: new FormControl<CustomerFinancial>(undefined),
    ftpUser: new FormControl(false),
    ftpUserData: new FormControl<FtpUserData>(undefined),
    contacts: new FormControl<CustomerContact[]>([]),
  });

  stateChanges = this.form.statusChanges;


  get isNew(): boolean {
    return !this.form.value._id;
  }

  get value() {
    return this.form.getRawValue();
  }

  get changes(): Partial<Customer> | undefined {
    if (this.initialValue) {
      const diff = pickBy(this.value, (value, key) => !isEqual(value, this.initialValue[key]));
      return Object.keys(diff).length ? diff : undefined;
    } else {
      return this.value;
    }
  }


  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private customersService: CustomersService,
  ) { }

  onData(customer: Customer) {
    customer = defaults(customer, DEFAULT_CUSTOMER);
    this.paytraqPanel?.close();
    if (customer._id) {
      this.form.controls.CustomerName.setAsyncValidators([]);
    } else {
      this.form.controls.CustomerName.setAsyncValidators([this.validateName()]);
    }
    this.setFtpUserDisabledState(customer.ftpUser, { emitEvent: false });

    this.form.reset(customer);
    this.initialValue = customer;

  }

  onReset(): void {
    this.form.reset(this.initialValue);
  }

  onCreate(): Observable<string | number> {
    const customer = pickBy(this.value, value => value !== null) as NewCustomer;
    return this.customersService.saveNewCustomer(customer);
  }

  onSave(): Observable<Customer> {
    const update = { ...this.changes, _id: this.value._id };
    return this.customersService.updateCustomer(update);
  }

  ngOnInit(): void {
  }

  canDeactivate(): boolean {
    return this.form.pristine || !this.changes;
  }

  onFtpUserState({ checked }: MatCheckboxChange) {
    this.setFtpUserDisabledState(checked);
  }

  private setFtpUserDisabledState(state: boolean, options?: { emitEvent: boolean; }): void {
    const control = this.form.controls.ftpUserData;
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
