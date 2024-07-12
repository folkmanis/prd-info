import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Customer, NewCustomer } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http/http-options';

@Injectable({
  providedIn: 'root',
})
export class CustomersApiService {
  private path = getAppParams('apiPath') + 'customers/';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  async getAll(params?: Record<string, any>): Promise<Customer[]> {
    return this.transformer.toInstanceAsync(Customer, this.http.get<Record<string, any>[]>(this.path, new HttpOptions(params).cacheable()), { exposeDefaultValues: false });
  }

  async getOne(idOrName: string, params?: Record<string, any>): Promise<Customer> {
    return this.transformer.toInstanceAsync(Customer, this.http.get<Record<string, any>>(this.path + idOrName, new HttpOptions(params).cacheable()));
  }

  async updateOne(id: string, data: Partial<Customer>): Promise<Customer> {
    return this.transformer.toInstanceAsync(Customer, this.http.patch<Record<string, any>>(this.path + id, this.transformer.instanceToPlain(data), new HttpOptions()));
  }

  async insertOne(customer: NewCustomer, params?: Record<string, any>): Promise<Customer> {
    return this.transformer.toInstanceAsync(Customer, this.http.put<Record<string, any>>(this.path, this.transformer.instanceToPlain(customer), new HttpOptions(params)));
  }

  async deleteOne(id: string, params?: Record<string, any>): Promise<number> {
    const data = await firstValueFrom(this.http.delete<{ deletedCount: number }>(this.path + id, new HttpOptions(params)));
    return data.deletedCount;
  }

  async validatorData<K extends keyof Customer & string>(key: K): Promise<Customer[K][]> {
    return firstValueFrom(this.http.get<Customer[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable()));
  }
}
