import { computed, inject, Service } from '@angular/core';
import { CreateCustomerDto, Customer, CustomerList, UpdateCustomerDto } from 'src/app/interfaces';
import { FilterInput, optionalString, stringToInt, toFilterSignal } from 'src/app/library';
import { CustomersApiService } from './prd-api/customers-api.service';
import { HttpResourceRef } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { z } from 'zod';
import { SchemaPath } from '@angular/forms/signals';
import { CustomerModel } from '../jobs-admin/customers/customer-edit/customer-edit.model';

export const CustomersQuerySchema = z
  .object({
    start: stringToInt,
    limit: stringToInt,
    name: optionalString.pipe(z.string().trim()),
    email: z.string(),
    disabled: z.stringbool(),
  })
  .partial();
export type CustomerFilter = z.output<typeof CustomersQuerySchema>;
export type CustomerQuery = z.input<typeof CustomersQuerySchema>;

@Service()
export class CustomersService {
  #api = inject(CustomersApiService);

  getCustomersResource(filter: FilterInput<CustomerFilter>): HttpResourceRef<CustomerList[] | undefined> {
    const filterSignal = toFilterSignal(filter);
    const query = computed(() => CustomersQuerySchema.encode(filterSignal()));
    return this.#api.customersResource(query);
  }

  updateCustomer(id: string, update: UpdateCustomerDto): Promise<Customer> {
    return firstValueFrom(this.#api.updateOne(id, update));
  }

  getCustomer(id: string): Promise<Customer> {
    return firstValueFrom(this.#api.getOne(id));
  }

  createCustomer(customer: CreateCustomerDto): Promise<Customer> {
    return firstValueFrom(this.#api.insertOne(customer));
  }

  getCustomerList(filter: CustomerFilter = {}): Observable<CustomerList[]> {
    const query = CustomersQuerySchema.encode(filter);
    return this.#api.getAll(query);
  }

  isPropertyAvailable<K extends keyof Pick<CustomerModel, 'customerName' | 'code'>>(
    schema: SchemaPath<CustomerModel[K]>,
    key: K,
  ): void {
    this.#api.validate(schema, key);
  }

  newCustomer(): Customer {
    return {
      _id: '',
      customerName: '',
      code: '',
      disabled: false,
      contacts: [],
    };
  }
}
