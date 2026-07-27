import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { SchemaPath } from '@angular/forms/signals';
import { isEqual } from 'lodash-es';
import { map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import {
  CreateCustomerDto,
  Customer,
  CustomerList,
  CustomerListSchema,
  CustomerSchema,
  UpdateCustomerDto,
} from 'src/app/interfaces';
import { CustomerModel, CustomerModelSchema } from 'src/app/jobs-admin/customers/customer-edit/customer-edit.model';
import {
  cacheable,
  httpFilter,
  httpFilterSignal,
  httpResponseRequest,
  optionalString,
  stringToInt,
  validatePropertyHttp,
  validatorFn,
} from 'src/app/library';
import { z } from 'zod';

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
export class CustomersApiService {
  #path = getAppParams('apiPath') + 'customers/';
  #http = inject(HttpClient);

  #customerValidatorFn = map(validatorFn(CustomerSchema));
  #customerArrayValidatorFn = map(validatorFn([CustomerListSchema]));

  getAll(filter?: CustomerFilter): Observable<CustomerList[]> {
    const params = httpFilter(CustomersQuerySchema, filter);
    return this.#http.get(this.#path, params.cacheable()).pipe(this.#customerArrayValidatorFn);
  }

  customersResource(filter: Signal<CustomerFilter | undefined>): HttpResourceRef<CustomerList[] | undefined> {
    const params = httpFilterSignal(CustomersQuerySchema, filter);
    return httpResource(() => httpResponseRequest(this.#path, params().cacheable()), {
      parse: validatorFn(CustomerListSchema.array()),
      equal: isEqual,
    });
  }

  getOne(idOrName: string): Observable<Customer> {
    return this.#http.get(this.#path + idOrName, cacheable()).pipe(this.#customerValidatorFn);
  }

  updateOne(id: string, data: UpdateCustomerDto): Observable<Customer> {
    return this.#http.patch(this.#path + id, data).pipe(this.#customerValidatorFn);
  }

  insertOne(customer: CreateCustomerDto): Observable<Customer> {
    return this.#http.put(this.#path, customer).pipe(this.#customerValidatorFn);
  }

  deleteOne(id: string): Observable<number> {
    return this.#http.delete<{ deletedCount: number }>(this.#path + id).pipe(map((data) => data.deletedCount));
  }

  validate<K extends keyof Pick<CustomerModel, 'customerName' | 'code'>>(
    schema: SchemaPath<CustomerModel[K]>,
    key: K,
  ): void {
    validatePropertyHttp(this.#path + 'validate', schema, key, CustomerModelSchema.shape[key]);
  }
}
