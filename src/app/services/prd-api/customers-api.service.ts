import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Customer, NewCustomer } from 'src/app/interfaces';
import { AppClassTransformerService, httpResponseRequest } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http/http-options';

@Injectable({
  providedIn: 'root',
})
export class CustomersApiService {
  private path = getAppParams('apiPath') + 'customers/';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  getAll(params?: Record<string, any>): Promise<Customer[]> {
    return this.transformer.toInstanceAsync(Customer, this.http.get<Record<string, any>[]>(this.path, new HttpOptions(params).cacheable()), { exposeDefaultValues: false });
  }

  customersResource(params: Signal<Record<string, any>>) {
    return httpResource(() => httpResponseRequest(this.path, new HttpOptions(params()).cacheable()), {
      defaultValue: [],
      parse: (data: Record<string, any>[]) => this.transformer.plainToInstance(Customer, data),
      equal: isEqual,
    });
  }

  getOne(idOrName: string, params?: Record<string, any>): Promise<Customer> {
    return this.transformer.toInstanceAsync(Customer, this.http.get<Record<string, any>>(this.path + idOrName, new HttpOptions(params).cacheable()));
  }

  updateOne(id: string, data: Partial<Customer>): Promise<Customer> {
    return this.transformer.toInstanceAsync(Customer, this.http.patch<Record<string, any>>(this.path + id, this.transformer.instanceToPlain(data), new HttpOptions()));
  }

  insertOne(customer: NewCustomer, params?: Record<string, any>): Promise<Customer> {
    return this.transformer.toInstanceAsync(Customer, this.http.put<Record<string, any>>(this.path, this.transformer.instanceToPlain(customer), new HttpOptions(params)));
  }

  deleteOne(id: string, params?: Record<string, any>): Promise<number> {
    const data$ = this.http.delete<{ deletedCount: number }>(this.path + id, new HttpOptions(params)).pipe(map((data) => data.deletedCount));
    return firstValueFrom(data$);
  }

  validatorData<K extends keyof Customer & string>(key: K): Promise<Customer[K][]> {
    return firstValueFrom(this.http.get<Customer[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable()));
  }
}
