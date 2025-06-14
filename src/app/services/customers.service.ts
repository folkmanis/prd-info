import { inject, Injectable } from '@angular/core';
import { Customer, CustomerContact, CustomerPartial, CustomerUpdate, NewCustomer } from 'src/app/interfaces';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { CustomersApiService } from './prd-api/customers-api.service';

export interface CustomerRequestFilter {
  name?: string;
  email?: string;
  disabled?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  #api = inject(CustomersApiService);

  getCustomersResource(filterSignal: FilterInput<CustomerRequestFilter>) {
    return this.#api.customersResource(toFilterSignal(filterSignal));
  }

  updateCustomer(id: string, update: CustomerUpdate): Promise<Customer> {
    return this.#api.updateOne(id, update);
  }

  getCustomer(id: string): Promise<Customer | never> {
    this.isValidId(id);
    return this.#api.getOne(id);
  }

  getCustomerByName(name: string): Promise<Customer> {
    return this.#api.getOne(name);
  }

  saveNewCustomer(customer: NewCustomer): Promise<Customer> {
    return this.#api.insertOne(customer);
  }

  getCustomerList(filter: CustomerRequestFilter = {}): Promise<CustomerPartial[]> {
    return this.#api.getAll(filter);
  }

  async isNameAvailable(name?: string): Promise<boolean> {
    if (!name) {
      return true;
    }
    name = name.toUpperCase();
    const values = await this.#api.validatorData('CustomerName');
    return values.every((value) => value.toUpperCase() !== name);
  }

  async isCustomerCodeAvailable(code?: string): Promise<boolean> {
    if (!code) {
      return true;
    }
    code = code.toUpperCase();
    const values = await this.#api.validatorData('code');
    return values.every((value) => value.toUpperCase() !== code);
  }

  newCustomerContact(email: string): CustomerContact {
    return { email };
  }

  newCustomer(): NewCustomer {
    return {
      CustomerName: '',
      code: '',
      disabled: false,
      description: '',
      ftpUser: false,
      contacts: [],
    };
  }

  private isValidId(str: any): asserts str is string {
    if (!/^[a-f\d]{24}$/i.test(str)) {
      throw new Error(`Invalid id ${str}`);
    }
  }
}
