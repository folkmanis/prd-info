import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { CustomerProduct, Product, ProductSchema, ProductPartial, ProductProductionStage } from 'src/app/interfaces';
import { ValidatorService } from 'src/app/library';
import { HttpOptions, httpResponseRequest } from 'src/app/library/http';
import { string } from 'zod';

export interface ProductsFilter {
  name?: string;
  start?: number;
  limit?: number;
  disabled?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  readonly #path = getAppParams('apiPath') + 'products/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  productsResource(filterSignal: Signal<ProductsFilter>): HttpResourceRef<ProductPartial[]> {
    return httpResource(() => httpResponseRequest(this.#path, new HttpOptions(filterSignal()).cacheable()), {
      defaultValue: [],
      parse: this.#validator.arrayValidatorFn(ProductSchema),
      equal: isEqual,
    });
  }

  productResource(id: Signal<string | undefined>): HttpResourceRef<Product | undefined> {
    return httpResource(() => (id() ? httpResponseRequest(this.#path + id()) : undefined), {
      parse: this.#validator.validatorFn(ProductSchema),
      equal: isEqual,
    });
  }

  productByNameResource(name: Signal<string | undefined>): HttpResourceRef<Product | undefined> {
    return httpResource(() => (name() ? httpResponseRequest(this.#path + 'name/' + name()) : undefined), {
      parse: this.#validator.validatorFn(ProductSchema),
      equal: isEqual,
    });
  }

  getProducts(filter: Record<string, any>) {
    const data$ = this.#http.get<Record<string, any>[]>(this.#path, new HttpOptions(filter).cacheable());
    return this.#validator.validateArrayAsync(ProductPartial, data$);
  }

  getOne(id: string): Promise<Product> {
    const data$ = this.#http.get<Record<string, any>>(this.#path + id, new HttpOptions().cacheable());
    return this.#validator.validateAsync(ProductSchema, data$);
  }

  getOneByName(name: string): Promise<Product> {
    const data$ = this.#http.get<Record<string, any>>(this.#path + 'name/' + name, new HttpOptions());
    return this.#validator.validateAsync(ProductSchema, data$);
  }

  deleteOne(id: string): Promise<number> {
    const data$ = this.#http
      .delete<{ deletedCount: number }>(this.#path + id, new HttpOptions())
      .pipe(map((data) => data.deletedCount));
    return firstValueFrom(data$);
  }

  updateOne(id: string, data: Partial<Product>): Promise<Product> {
    const update$ = this.#http.patch<Record<string, any>>(this.#path + id, data, new HttpOptions());
    return this.#validator.validateAsync(ProductSchema, update$);
  }

  insertOne(data: Partial<Product>): Promise<Product> {
    const update$ = this.#http.put<Record<string, any>>(this.#path, data, new HttpOptions());
    return this.#validator.validateAsync(ProductSchema, update$);
  }

  validatorData<K extends keyof Product & string>(key: K): Promise<Product[K][]> {
    return firstValueFrom(this.#http.get<Product[K][]>(this.#path + 'validate/' + key, new HttpOptions().cacheable()));
  }

  productsCustomerResource(name: Signal<string | undefined>): HttpResourceRef<CustomerProduct[] | undefined> {
    return httpResource(() => (name() ? httpResponseRequest(this.#path + 'prices/customer/' + name()) : undefined), {
      parse: this.#validator.arrayValidatorFn(CustomerProduct),
      equal: isEqual,
    });
  }

  productsCustomer(customer: string): Promise<CustomerProduct[]> {
    const data$ = this.#http.get<Record<string, any>[]>(
      this.#path + 'prices/customer/' + customer,
      new HttpOptions().cacheable(),
    );
    return this.#validator.validateArrayAsync(CustomerProduct, data$);
  }

  productionStages(productName: string): Promise<ProductProductionStage[]> {
    const data$ = this.#http.get<Record<string, any>[]>(
      this.#path + productName + '/productionStages',
      new HttpOptions().cacheable(),
    );
    return this.#validator.validateArrayAsync(ProductProductionStage, data$);
  }
}
