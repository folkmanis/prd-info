import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncValidatorFn, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { isEqual, isNull, omitBy } from 'lodash-es';
import { Customer, CustomerContact, CustomerFinancial, FtpUserData, NewCustomer, ShippingAddress } from 'src/app/interfaces';
import { InputUppercaseDirective } from 'src/app/library/directives/input-uppercase.directive';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { navigateRelative } from 'src/app/library/navigation';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { CustomersService } from 'src/app/services';
import { configuration } from 'src/app/services/config.provider';
import { CustomersListComponent } from '../customers-list/customers-list.component';
import { CustomerContactsComponent } from './customer-contacts/customer-contacts.component';
import { FtpUserComponent } from './ftp-user/ftp-user.component';
import { PaytraqCustomerComponent } from './paytraq-customer/paytraq-customer.component';
import { ShippingAddressComponent } from './shipping-address/shipping-address.component';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    SimpleFormContainerComponent,
    PaytraqCustomerComponent,
    InputUppercaseDirective,
    FtpUserComponent,
    CustomerContactsComponent,
    ShippingAddressComponent,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
    MatCheckboxModule,
    MatInput,
  ],
})
export class CustomerEditComponent implements CanComponentDeactivate {
  private customersService = inject(CustomersService);

  private navigate = navigateRelative();

  paytraqEnabled = configuration('paytraq', 'enabled');

  form = inject(FormBuilder).group(
    {
      CustomerName: [null as string | null, [Validators.required, Validators.minLength(3)], [this.validateName()]],
      code: [null as string | null, [Validators.required, Validators.minLength(2), Validators.maxLength(3)], [this.validateCode()]],
      disabled: [false as boolean | null],
      description: [null as string | null],
      financial: [null as CustomerFinancial | null],
      ftpUser: [false as boolean | null],
      ftpUserData: [null as FtpUserData | null],
      contacts: [[] as CustomerContact[]],
      insertedFromXmf: [null as Date | null],
      shippingAddress: [null as ShippingAddress | null],
    },
    {
      validators: [this.validateFtp()],
    },
  );

  customer = input.required<Customer>();

  customersListComponent = inject(CustomersListComponent);

  formValue = toSignal(this.form.valueChanges, {
    initialValue: this.form.value,
  });

  changes = computed(() => {
    const value = this.formValue();
    const initialValue = this.customer();
    const diff = omitBy(value, (val, key) => isEqual(val, initialValue[key]));
    return Object.keys(diff).length ? diff : null;
  });

  constructor() {
    effect(() => {
      this.form.reset(this.customer());
    });
  }

  onReset(): void {
    this.form.reset(this.customer());
  }

  async onSave() {
    let id = this.customer()._id;
    if (id) {
      const update = { ...this.changes(), _id: this.customer()._id };
      await this.customersService.updateCustomer(update);
      this.onReload();
    } else {
      const customer = omitBy(this.formValue(), isNull) as NewCustomer;
      const createdCustomer = await this.customersService.saveNewCustomer(customer);
      id = createdCustomer._id;
      this.onReload();
    }

    this.form.markAsPristine();
    this.navigate(['..', id], { queryParams: { upd: Date.now() } });
  }

  canDeactivate(): boolean {
    return this.form.pristine || !this.changes();
  }

  private validateCode(): AsyncValidatorFn {
    return async (control) => {
      if (this.customer().code === control.value) {
        return null;
      } else {
        return (await this.customersService.isCustomerCodeAvailable(control.value)) ? null : { occupied: control.value };
      }
    };
  }

  private validateName(): AsyncValidatorFn {
    return async (control) => {
      if (this.customer().CustomerName === control.value) {
        return null;
      } else {
        return (await this.customersService.isNameAvailable(control.value)) ? null : { occupied: control.value };
      }
    };
  }

  private validateFtp(): ValidatorFn {
    return (control) => {
      return control.value.ftpUser === false || !!control.value.ftpUserData ? null : { ftpUserData: 'ftp data not set' };
    };
  }

  private onReload() {
    this.customersListComponent.onReload();
  }
}
