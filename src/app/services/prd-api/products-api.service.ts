import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { CustomerProduct, Product, ProductionStage, ProductPartial, ProductProductionStage } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions, httpResponseRequest } from 'src/app/library/http';

export interface ProductsFilter {
  name?: string;
  start?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  readonly path = getAppParams('apiPath') + 'products/';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  productsResource(filterSignal: Signal<ProductsFilter>): HttpResourceRef<ProductPartial[]> {
    return httpResource(() => httpResponseRequest(this.path, new HttpOptions(filterSignal()).cacheable()), {
      defaultValue: [],
      parse: (data: Record<string, any>[]) => this.transformer.plainToInstance(Product, data),
      equal: isEqual,
    });
  }

  getOne(id: string): Promise<Product> {
    const data$ = this.http.get<Record<string, any>>(this.path + id, new HttpOptions().cacheable());
    return this.transformer.toInstanceAsync(Product, data$);
  }

  getOneByName(name: string): Promise<Product> {
    const data$ = this.http.get<Record<string, any>>(this.path + 'name/' + name, new HttpOptions());
    return this.transformer.toInstanceAsync(Product, data$);
  }

  deleteOne(id: string): Promise<number> {
    const data$ = this.http.delete<{ deletedCount: number }>(this.path + id, new HttpOptions()).pipe(map((data) => data.deletedCount));
    return firstValueFrom(data$);
  }

  updateOne(id: string, data: Partial<Product>): Promise<Product> {
    const update$ = this.http.patch<Record<string, any>>(this.path + id, data, new HttpOptions());
    return this.transformer.toInstanceAsync(Product, update$);
  }

  insertOne(data: Partial<Product>): Promise<Product> {
    const update$ = this.http.put<Record<string, any>>(this.path, data, new HttpOptions());
    return this.transformer.toInstanceAsync(Product, update$);
  }

  validatorData<K extends keyof Product & string>(key: K): Promise<Product[K][]> {
    return firstValueFrom(this.http.get<Product[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable()));
  }

  productsCustomer(customer: string): Promise<CustomerProduct[]> {
    const data$ = this.http.get<Record<string, any>[]>(this.path + 'prices/customer/' + customer, new HttpOptions().cacheable());
    return this.transformer.toInstanceAsync(CustomerProduct, data$);
  }

  productionStages(productName: string): Promise<ProductProductionStage[]> {
    const data$ = this.http.get<Record<string, any>[]>(this.path + productName + '/productionStages', new HttpOptions().cacheable());
    return this.transformer.toInstanceAsync(ProductProductionStage, data$);
  }
}
