import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatExpansionPanel } from '@angular/material/expansion';
import { plainToInstance } from 'class-transformer';
import { isEqual, pickBy } from 'lodash';
import { map, Observable, of, pluck } from 'rxjs';
import { Customer, CustomerContact, CustomerFinancial, FtpUserData, NewCustomer, SystemPreferences } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { SimpleFormTypedControl } from 'src/app/library/simple-form-typed';
import { CustomersService } from 'src/app/services';
import { CONFIG } from 'src/app/services/config.provider';

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
      [this.validateName()]
    ),
    code: new FormControl(
      '',
      [Validators.required, Validators.minLength(2), Validators.maxLength(3)],
      [this.validateCode()]
    ),
    disabled: new FormControl(false),
    description: new FormControl(''),
    financial: new FormControl<CustomerFinancial>(undefined),
    ftpUser: new FormControl(null),
    ftpUserData: new FormControl<FtpUserData>(null),
    contacts: new FormControl<CustomerContact[]>(undefined),
    insertedFromXmf: new FormControl<Date>(undefined),
  });

  stateChanges = this.form.statusChanges;


  get isNew(): boolean {
    return !this.form.value._id;
  }

  get value() {
    return plainToInstance(Customer, this.form.value);
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
    this.initialValue = { ...customer };
    this.onReset();
  }

  onReset(): void {
    this.form.reset(this.initialValue);
    this.paytraqPanel?.close();
    this.setFtpUserDisabledState();
  }

  onCreate(): Observable<string | number> {
    const customer = pickBy(this.value, value => value !== null) as NewCustomer;
    return this.customersService.saveNewCustomer(customer);
  }

  onUpdate(): Observable<Customer> {
    const update = { ...this.changes, _id: this.value._id };
    return this.customersService.updateCustomer(update);
  }

  ngOnInit(): void {
  }

  canDeactivate(): boolean {
    return this.form.pristine || !this.changes;
  }

  onFtpUserState({ checked }: MatCheckboxChange) {
    this.setFtpUserDisabledState();
  }

  private setFtpUserDisabledState(): void {
    if (this.form.value.ftpUser) {
      this.form.controls.ftpUserData.enable();
    } else {
      this.form.controls.ftpUserData.disable();
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
