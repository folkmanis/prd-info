import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Customer, CustomerUpdate, NewCustomer } from 'src/app/interfaces';
import { HttpOptions, httpResponseRequest, ValidatorService } from 'src/app/library';

@Injectable({
  providedIn: 'root',
})
export class CustomersApiService {
  #path = getAppParams('apiPath') + 'customers/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  getAll(params?: Record<string, any>) {
    const data$ = this.#http.get<Record<string, any>[]>(this.#path, new HttpOptions(params).cacheable());
    return this.#validator.validateArrayAsync(Customer, data$);
  }

  customersResource(params: Signal<Record<string, any>>) {
    return httpResource(() => httpResponseRequest(this.#path, new HttpOptions(params()).cacheable()), {
      parse: this.#validator.arrayValidatorFn(Customer),
      equal: isEqual,
    });
  }

  async getOne(idOrName: string, params?: Record<string, any>): Promise<Customer> {
    return this.#validator.validateAsync(Customer, this.#http.get(this.#path + idOrName, new HttpOptions(params).cacheable()));
  }

  async updateOne(id: string, data: CustomerUpdate): Promise<Customer> {
    const result$ = this.#http.patch<Record<string, any>>(this.#path + id, data, new HttpOptions());
    const result = await firstValueFrom(result$);
    return this.#validator.validate(Customer, result);
  }

  insertOne(customer: NewCustomer, params?: Record<string, any>): Promise<Customer> {
    const result$ = this.#http.put<Record<string, any>>(this.#path, customer, new HttpOptions(params));
    return this.#validator.validateAsync(Customer, result$);
  }

  deleteOne(id: string, params?: Record<string, any>): Promise<number> {
    const result$ = this.#http.delete<{ deletedCount: number }>(this.#path + id, new HttpOptions(params)).pipe(map((data) => data.deletedCount));
    return firstValueFrom(result$);
  }

  validatorData<K extends keyof Customer & string>(key: K): Promise<Customer[K][]> {
    return firstValueFrom(this.#http.get<Customer[K][]>(this.#path + 'validate/' + key, new HttpOptions().cacheable()));
  }
}
