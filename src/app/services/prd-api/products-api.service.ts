import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { CustomerProduct, Product, ProductionStage, ProductPartial, ProductProductionStage } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';

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

  async getAll(filter: ProductsFilter): Promise<ProductPartial[]> {
    const data$ = this.http.get<Record<string, any>[]>(this.path, new HttpOptions(filter).cacheable());
    return this.transformer.toInstanceAsync(Product, data$);
  }

  async getOne(id: string): Promise<Product> {
    const data$ = this.http.get<Record<string, any>>(this.path + id, new HttpOptions().cacheable());
    return this.transformer.toInstanceAsync(Product, data$);
  }

  async getOneByName(name: string): Promise<Product> {
    const data$ = this.http.get<Record<string, any>>(this.path + 'name/' + name, new HttpOptions());
    return this.transformer.toInstanceAsync(Product, data$);
  }

  async deleteOne(id: string): Promise<number> {
    const response$ = this.http.delete<{ deletedCount: number }>(this.path + id, new HttpOptions());
    return (await firstValueFrom(response$)).deletedCount;
  }

  async updateOne(id: string, data: Partial<Product>): Promise<Product> {
    const update$ = this.http.patch<Record<string, any>>(this.path + id, data, new HttpOptions());
    return this.transformer.toInstanceAsync(Product, update$);
  }

  async insertOne(data: Partial<Product>): Promise<Product> {
    const update$ = this.http.put<Record<string, any>>(this.path, data, new HttpOptions());
    return this.transformer.toInstanceAsync(Product, update$);
  }

  async validatorData<K extends keyof Product & string>(key: K): Promise<Product[K][]> {
    return firstValueFrom(this.http.get<Product[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable()));
  }

  async productsCustomer(customer: string): Promise<CustomerProduct[]> {
    const data$ = this.http.get<Record<string, any>[]>(this.path + 'prices/customer/' + customer, new HttpOptions().cacheable());
    return this.transformer.plainToInstance(CustomerProduct, await firstValueFrom(data$));
  }

  async productionStages(productName: string): Promise<ProductProductionStage[]> {
    const data$ = this.http.get<Record<string, any>[]>(this.path + productName + '/productionStages', new HttpOptions().cacheable());
    return this.transformer.plainToInstance(ProductProductionStage, await firstValueFrom(data$));
  }
}
