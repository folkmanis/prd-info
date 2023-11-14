import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  computed,
  effect,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { isEqual, pickBy } from 'lodash-es';
import { Observable, Subscription, map, of } from 'rxjs';
import { Customer, NewCustomer } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { MaterialLibraryModule } from 'src/app/library/material-library.module';
import { SimpleFormContainerComponent } from 'src/app/library/simple-form';
import { CustomersService } from 'src/app/services';
import { getConfig } from 'src/app/services/config.provider';
import { CustomerContactsComponent } from './customer-contacts/customer-contacts.component';
import { FtpUserComponent } from './ftp-user/ftp-user.component';
import { InputUppercaseDirective } from 'src/app/library/directives/input-uppercase.directive';
import { PaytraqCustomerComponent } from './paytraq-customer/paytraq-customer.component';

type CustomerEditable = Omit<Customer, '_id'>;
type CustomerEditGroup = FormGroup<{
  [key in keyof CustomerEditable]-?: FormControl<CustomerEditable[key]>;
}>;

@Component({
  selector: 'app-customer-edit',
  standalone: true,
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialLibraryModule,
    ReactiveFormsModule,
    SimpleFormContainerComponent,
    PaytraqCustomerComponent,
    InputUppercaseDirective,
    FtpUserComponent,
    CustomerContactsComponent,
  ],
})
export class CustomerEditComponent implements CanComponentDeactivate {
  @ViewChild('paytraqPanel') paytraqPanel: MatExpansionPanel;

  paytraqEnabled = toSignal(getConfig('paytraq', 'enabled'));

  form = this.createForm();

  private _initialValue: Customer = new Customer();
  set initialValue(value: Customer) {
    this._initialValue = value;
    this.form.reset(this.initialValue);
  }
  get initialValue() {
    return this._initialValue;
  }

  formValue = toSignal(this.form.valueChanges, {
    initialValue: this.initialValue,
  });

  changes = computed(() => {
    const value = this.formValue();
    const diff = pickBy(
      value,
      (val, key) => !isEqual(val, this.initialValue[key])
    );
    return Object.keys(diff).length ? diff : undefined;
  });

  private routeData = toSignal(this.route.data);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService,
    private fb: FormBuilder
  ) {
    effect(
      () => {
        this.initialValue = this.routeData().customer as Customer;
      },
      { allowSignalWrites: true }
    );
  }

  onReset(): void {
    this.form.reset(this.initialValue);
    this.paytraqPanel?.close();
  }

  onSave(): void {
    if (this.initialValue._id) {
      const update = { ...this.changes(), _id: this.initialValue._id };
      const obs = this.customersService.updateCustomer(update);
      this.saveAndNavigate(obs);
    } else {
      const customer = pickBy(
        this.formValue(),
        (val) => val !== null
      ) as NewCustomer;
      const obs = this.customersService.saveNewCustomer(customer);
      this.saveAndNavigate(obs);
    }
  }

  canDeactivate(): boolean {
    return this.form.pristine || !this.changes();
  }

  private saveAndNavigate(obs: Observable<Customer>): Subscription {
    return obs.subscribe((customer) => {
      this.form.markAsPristine();
      this.router.navigate(['..', customer._id], {
        relativeTo: this.route,
        queryParams: { upd: Date.now() },
      });
    });
  }

  private createForm(): CustomerEditGroup {
    return this.fb.group({
      CustomerName: [
        '',
        [Validators.required, Validators.minLength(3)],
        [this.validateName()],
      ],
      code: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(3)],
        [this.validateCode()],
      ],
      disabled: [false],
      description: [''],
      financial: [null],
      ftpUser: [false],
      ftpUserData: [null],
      contacts: [],
      insertedFromXmf: [null],
    });
  }

  private validateCode(): AsyncValidatorFn {
    return (control) => {
      if (this.initialValue?.code === control.value) {
        return of(null);
      } else {
        return this.customersService
          .validator('code', control.value)
          .pipe(map((val) => (val ? null : { occupied: control.value })));
      }
    };
  }

  private validateName(): AsyncValidatorFn {
    return (control) => {
      if (this.initialValue?.CustomerName === control.value) {
        return of(null);
      } else {
        return this.customersService
          .validator('CustomerName', control.value)
          .pipe(map((val) => (val ? null : { occupied: control.value })));
      }
    };
  }
}
