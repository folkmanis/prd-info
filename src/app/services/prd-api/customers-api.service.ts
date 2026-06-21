import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { SchemaPath, validateHttp } from '@angular/forms/signals';
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
import { HttpOptions, httpResponseRequest, ValidatorService } from 'src/app/library';
import { NETWORK_ERROR } from 'src/app/library/http/network-error';

@Injectable({
  providedIn: 'root',
})
export class CustomersApiService {
  #path = getAppParams('apiPath') + 'customers/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);
  #customerValidatorFn = map(this.#validator.validatorFn(CustomerSchema));
  #customerArrayValidatorFn = map(this.#validator.validatorFn(CustomerListSchema.array()));

  getAll(query: Record<string, string>): Observable<CustomerList[]> {
    return this.#http.get(this.#path, new HttpOptions(query).cacheable()).pipe(this.#customerArrayValidatorFn);
  }

  customersResource(query: Signal<Record<string, string> | undefined>): HttpResourceRef<CustomerList[] | undefined> {
    return httpResource(
      () => (query() ? httpResponseRequest(this.#path, new HttpOptions(query()).cacheable()) : undefined),
      {
        parse: this.#validator.arrayValidatorFn(CustomerListSchema),
        equal: isEqual,
      },
    );
  }

  getOne(idOrName: string): Observable<Customer> {
    return this.#http.get(this.#path + idOrName, new HttpOptions().cacheable()).pipe(this.#customerValidatorFn);
  }

  updateOne(id: string, data: UpdateCustomerDto): Observable<Customer> {
    return this.#http.patch(this.#path + id, data, new HttpOptions()).pipe(this.#customerValidatorFn);
  }

  insertOne(customer: CreateCustomerDto, params?: Record<string, any>): Observable<Customer> {
    return this.#http.put(this.#path, customer, new HttpOptions(params)).pipe(this.#customerValidatorFn);
  }

  deleteOne(id: string): Observable<number> {
    return this.#http
      .delete<{ deletedCount: number }>(this.#path + id, new HttpOptions())
      .pipe(map((data) => data.deletedCount));
  }

  validate<K extends keyof Pick<Customer, 'customerName' | 'code'>>(schema: SchemaPath<Customer[K]>, key: K): void {
    validateHttp(schema, {
      request: ({ value }) =>
        httpResponseRequest(this.#path + 'validate/' + key, new HttpOptions({ value: value() }).cacheable()),
      onSuccess: (response: boolean, { value }) => {
        const current = value()?.toUpperCase();
        if (!response) {
          return {
            kind: 'used',
            message: `"${value()}" jau tiek izmantots!`,
          };
        } else {
          return null;
        }
      },
      onError: () => NETWORK_ERROR,
    });
  }
}
