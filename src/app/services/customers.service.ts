import { HttpResourceRef } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { SchemaPath } from '@angular/forms/signals';
import { firstValueFrom, Observable } from 'rxjs';
import { CreateCustomerDto, Customer, CustomerList, UpdateCustomerDto } from 'src/app/interfaces';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { CustomerModel } from '../jobs-admin/customers/customer-edit/customer-edit.model';
import { CustomerFilter, CustomersApiService } from './prd-api/customers-api.service';

@Service()
export class CustomersService {
  #api = inject(CustomersApiService);

  getCustomersResource(filter: FilterInput<CustomerFilter>): HttpResourceRef<CustomerList[] | undefined> {
    return this.#api.customersResource(toFilterSignal(filter));
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

  getCustomerList(filter?: CustomerFilter): Observable<CustomerList[]> {
    return this.#api.getAll(filter);
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
