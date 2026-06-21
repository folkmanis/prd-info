import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  signal,
  untracked,
} from '@angular/core';
import {
  applyEach,
  applyWhen,
  applyWhenValue,
  disabled,
  email,
  FieldTree,
  form,
  FormField,
  FormRoot,
  maxLength,
  minLength,
  readonly,
  required,
  SchemaPath,
} from '@angular/forms/signals';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatOption, MatSelect } from '@angular/material/select';
import { Customer, CustomerContact, defaultCustomerContact } from 'src/app/interfaces';
import { notNullOrThrow } from 'src/app/library';
import { InputUppercaseDirective } from 'src/app/library/directives/input-uppercase.directive';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { navigateRelative } from 'src/app/library/navigation';
import { computedSignalChanges, pickChanges } from 'src/app/library/signals';
import { SimpleContentContainerComponent } from 'src/app/library/simple-form/simple-content-container/simple-content-container.component';
import { updateCatching } from 'src/app/library/update-catching';
import { CustomersService } from 'src/app/services';
import { configuration } from 'src/app/services/config.provider';
import { CustomersListComponent } from '../customers-list/customers-list.component';
import {
  CustomerModel,
  customerToModel,
  defaultShippingAddressModel,
  modelToCreateCustomer,
  modelToUpdateCustomer,
} from './customer-edit.model';
import { CustomerEditService } from './customer-edit.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormField,
    FormRoot,
    SimpleContentContainerComponent,
    InputUppercaseDirective,
    MatFormFieldModule,
    MatCardModule,
    MatDivider,
    MatCheckboxModule,
    MatInput,
    MatIcon,
    MatProgressSpinner,
    MatButton,
    AsyncPipe,
    MatSelect,
    MatOption,
    MatList,
    MatListItem,
  ],
})
export class CustomerEditComponent implements CanComponentDeactivate {
  protected paytraqEnabled = configuration('paytraq', 'enabled');
  protected busy = signal(false);
  #update = updateCatching(this.busy);
  #customersService = inject(CustomersService);
  #formService = inject(CustomerEditService);
  #navigate = navigateRelative();

  #customersListComponent = inject(CustomersListComponent);

  protected ftpFolders$ = this.#formService.ftpFolders$;

  protected activeContact = signal<FieldTree<CustomerContact> | null>(null);

  customer = input.required<Customer>();
  #initialCustomer = linkedSignal(() => this.customer());
  #initialModel = linkedSignal(() => customerToModel(this.#initialCustomer()));
  #customerModel = linkedSignal(() => {
    const initial = this.#initialModel();
    untracked(() => this.form().reset(initial));
    return initial;
  });

  protected changes = computedSignalChanges(this.#customerModel, this.#initialModel, { includeNull: true });

  form = form(
    this.#customerModel,
    (schema) => {
      required(schema.customerName, { message: `Nosaukums jāievada obligāti!` });
      readonly(schema.customerName, { when: () => this.isNew() === false });
      required(schema.code, { message: `Kodu jāievada obligāti!` });
      minLength(schema.code, 2, { message: `Kodam jābūt 2-3 zīmes garam` });
      maxLength(schema.code, 3, { message: `Kodam jābūt 2-3 zīmes garam` });
      this.#validateName(schema.customerName);
      this.#validateCode(schema.code);

      // contact
      applyEach(schema.contacts, (s) => {
        required(s.email);
        email(s.email);
      });

      // address
      applyWhenValue(
        schema.shippingAddress,
        (value) => !!value.address,
        (s) => {
          required(s.country);
          required(s.zip);
        },
      );
    },
    {
      submission: {
        action: async (schema) => {
          await this.#saveCustomer(schema().value());
        },
        ignoreValidators: 'none',
      },
    },
  );

  protected isNew = computed(() => !this.#initialCustomer()._id);

  canDeactivate(): boolean {
    return this.form().dirty() === false || this.changes() === null;
  }

  protected onReset() {
    this.form().reset(this.#initialModel());
  }

  protected onAddContact() {
    this.#customerModel.update((customer) => ({
      ...customer,
      contacts: [...customer.contacts, defaultCustomerContact()],
    }));
    const contact = this.form.contacts[this.form.contacts.length - 1];
    this.activeContact.set(contact);
    setTimeout(() => {
      contact().focusBoundControl();
    }, 100);
  }

  protected onRemoveContact(idx: number) {
    this.#customerModel.update((customer) => ({
      ...customer,
      contacts: customer.contacts.filter((c, i) => i !== idx),
    }));
  }

  protected async onSelectFinancial() {
    const { customerName } = this.#customerModel();
    const result = await this.#formService.selectPaytraqCustomer(customerName);
    if (result) {
      this.#customerModel.update((customer) => ({
        ...customer,
        financial: {
          clientName: result.clientName,
          paytraqId: result.paytraqId.toString(),
        },
      }));
    }
  }

  protected onRemoveFinancial() {
    this.#customerModel.update((customer) => ({
      ...customer,
      financial: {
        clientName: '',
        paytraqId: '',
      },
    }));
  }

  protected async onAddressMap() {
    const address = this.form.shippingAddress().value();
    const update = await this.#formService.getShippingMarker(address.address || undefined);
    if (update) {
      this.#customerModel.update((customer) => ({
        ...customer,
        shippingAddress: {
          ...customer.shippingAddress,
          ...update,
        },
      }));
    }
  }

  protected async onPaytraqAddress(paytraqId: string) {
    this.#update(async (message) => {
      const update = await this.#formService.getPaytraqAddress(Number.parseInt(paytraqId));
      if (update) {
        this.#customerModel.update((customer) => ({
          ...customer,
          shippingAddress: {
            ...customer.shippingAddress,
            ...update,
          },
        }));
        message(`Adrese no Paytraq pievienota`);
      }
    });
  }

  protected onResetAddress() {
    this.form.shippingAddress().value.set(defaultShippingAddressModel());
  }

  #validateCode(schema: SchemaPath<string>) {
    applyWhen(
      schema,
      ({ value }) => value() !== this.#initialModel().code,
      (s) => {
        this.#customersService.isCustomerCodeAvailable(s);
      },
    );
  }

  #validateName(schema: SchemaPath<string>) {
    applyWhen(
      schema,
      ({ value }) => value() !== this.#initialModel().customerName,
      (s) => {
        this.#customersService.isNameAvailable(s);
      },
    );
  }

  #onReload() {
    this.#customersListComponent.onReload();
  }

  async #saveCustomer(value: CustomerModel) {
    this.#update(async (message) => {
      const { _id } = this.#initialCustomer();
      if (_id) {
        const customer = await this.#createCustomer(value);
        message(`Jauns lietotājs ${customer.customerName} izveidots!`);
      } else {
        await this.#updateCustomer(_id, value);
        message(`Izmaiņas saglabātas`);
      }
    });
  }

  async #createCustomer(value: CustomerModel): Promise<Customer> {
    const create = modelToCreateCustomer(value);
    const customer = await this.#customersService.createCustomer(create);
    this.#onReload();
    this.form().reset();
    this.#navigate(['..', customer._id]);
    return customer;
  }

  async #updateCustomer(id: string, value: CustomerModel): Promise<Customer> {
    const changes = notNullOrThrow(pickChanges(value, this.#initialModel(), { includeNull: true }));
    const update = modelToUpdateCustomer(changes);
    const customer = await this.#customersService.updateCustomer(id, update);
    this.#initialCustomer.set(customer);
    this.#onReload();
    this.form().reset();
    return customer;
  }
}
