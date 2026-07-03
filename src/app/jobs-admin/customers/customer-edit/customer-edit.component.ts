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
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Customer, CustomerContact, defaultCustomerContact } from 'src/app/interfaces';
import { notNullOrThrow } from 'src/app/library';
import { InputUppercaseDirective } from 'src/app/library/directives/input-uppercase.directive';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { navigateRelative } from 'src/app/library/navigation';
import { computedChanges, pickChanges } from 'src/app/library/signals';
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
    MatIconButton,
    MatButton,
    MatList,
    MatListItem,
    MatMenuModule,
    AsyncPipe,
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

  protected locationServiceEnabled = this.#formService.locationServiceEnabled;

  customer = input.required<Customer>();
  #initialCustomer = linkedSignal(() => this.customer());
  #initialModel = linkedSignal(() => customerToModel(this.#initialCustomer()));
  #customerModel = linkedSignal(() => this.#initialModel());

  form = form(
    this.#customerModel,
    (schema) => {
      disabled(schema, { when: () => this.busy() });

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

  protected isNew = computed(() => !this.customer()._id);

  constructor() {
    effect(() => {
      this.#initialCustomer();
      untracked(() => {
        this.form().reset();
      });
    });
  }

  canDeactivate(): boolean {
    return this.form().dirty() === false;
  }

  protected onReset() {
    this.form().reset(customerToModel(this.#initialCustomer()));
  }

  protected onRemoveFtpData() {
    this.#customerModel.update((customer) => ({
      ...customer,
      ftpUserData: {
        folder: '',
        password: '',
        username: '',
      },
    }));
    this.form.ftpUserData().markAsDirty();
  }

  protected onAddContact() {
    this.#customerModel.update((customer) => ({
      ...customer,
      contacts: [...customer.contacts, defaultCustomerContact()],
    }));
    this.form.contacts().markAsDirty();
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
    this.form.contacts().markAsDirty();
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
      this.form.financial().markAsDirty();
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
    this.form.financial().markAsDirty();
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
      this.form.shippingAddress().markAsDirty();
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
        this.form.shippingAddress().markAsDirty();
      }
    });
  }

  protected onResetAddress() {
    this.#customerModel.update((customer) => ({
      ...customer,
      shippingAddress: defaultShippingAddressModel(),
    }));
    this.form.shippingAddress().markAsDirty();
  }

  #validateCode(schema: SchemaPath<string>) {
    applyWhen(
      schema,
      ({ value }) => value() !== this.#initialModel().code,
      (s) => {
        this.#customersService.isPropertyAvailable(s, 'code');
      },
    );
  }

  #validateName(schema: SchemaPath<string>) {
    applyWhen(
      schema,
      ({ value }) => value() !== this.#initialModel().customerName,
      (s) => {
        this.#customersService.isPropertyAvailable(s, 'customerName');
      },
    );
  }

  async #saveCustomer(value: CustomerModel) {
    await this.#update(async (message) => {
      const { _id } = this.customer();
      if (_id) {
        await this.#updateCustomer(_id, value);
        message(`Izmaiņas saglabātas`);
      } else {
        const customer = await this.#createCustomer(value);
        message(`Jauns lietotājs ${customer.customerName} izveidots!`);
      }
    });
  }

  async #createCustomer(value: CustomerModel): Promise<Customer> {
    const create = modelToCreateCustomer(value);
    const customer = await this.#customersService.createCustomer(create);
    this.#customersListComponent.onReload();
    this.form().reset();
    this.#navigate(['..', customer._id]);
    return customer;
  }

  async #updateCustomer(id: string, value: CustomerModel): Promise<void> {
    const changes = computedChanges(value, this.#initialModel(), { includeNull: true });
    let customer: Customer;
    if (changes) {
      const update = modelToUpdateCustomer(changes);
      customer = await this.#customersService.updateCustomer(id, update);
    } else {
      customer = await this.#customersService.getCustomer(id);
    }
    this.#initialCustomer.set(customer);
    this.#customersListComponent.onReload();
  }
}
