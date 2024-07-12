import { computed, inject, Injectable, signal } from '@angular/core';
import { Customer, CustomerPartial, CustomerUpdate, NewCustomer } from 'src/app/interfaces';
import { CustomersApiService } from './prd-api/customers-api.service';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private api = inject(CustomersApiService);

  readonly #customers = signal([] as CustomerPartial[]);

  customers = this.#customers.asReadonly();

  customersEnabled = computed(() => this.#customers().filter((customer) => !customer.disabled));

  constructor() {
    this.reload();
  }

  async reload() {
    try {
      const data = await this.api.getAll({ disabled: true });
      this.#customers.set(data);
    } catch (error) {
      this.#customers.set([]);
    }
  }

  async updateCustomer({ _id, ...rest }: CustomerUpdate): Promise<Customer> {
    const updated = await this.api.updateOne(_id, rest);
    await this.reload();
    return updated;
  }

  async getCustomer(id: string): Promise<Customer | never> {
    this.isValidId(id);
    return this.api.getOne(id);
  }

  async getCustomerByName(name: string): Promise<Customer> {
    return this.api.getOne(name);
  }

  async saveNewCustomer(customer: NewCustomer): Promise<Customer> {
    const updated = await this.api.insertOne(customer);
    await this.reload();
    return updated;
  }

  async getCustomerList(filter: { name?: string; email?: string; disabled?: boolean } = {}): Promise<CustomerPartial[]> {
    return this.api.getAll({ disabled: true, ...filter });
  }

  async isNameAvailable(name?: string): Promise<boolean> {
    if (!name) {
      return true;
    }
    name = name.toUpperCase();
    const values = await this.api.validatorData('CustomerName');
    return values.every((value) => value.toUpperCase() !== name);
  }

  async isCustomerCodeAvailable(code?: string): Promise<boolean> {
    if (!code) {
      return true;
    }
    code = code.toUpperCase();
    const values = await this.api.validatorData('code');
    return values.every((value) => value.toUpperCase() !== code);
  }

  private isValidId(str: any): asserts str is string {
    if (!/^[a-f\d]{24}$/i.test(str)) {
      throw new Error(`Invalid id ${str}`);
    }
  }
}
