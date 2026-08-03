import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import {
  CustomerProductSchema,
  CustomerProduct,
  pluckDeletedCount,
  Product,
  ProductPartial,
  ProductProductionStage,
  ProductSchema,
} from 'src/app/interfaces';
import { httpFilterSignal, optionalString, stringToInt, validatorFn } from 'src/app/library';
import { cacheable, httpResponseRequest } from 'src/app/library/http';
import { z } from 'zod';

const ProductsFilterSchema = z
  .object({
    name: optionalString,
    start: stringToInt,
    limit: stringToInt,
    disabled: z.stringbool(),
  })
  .partial();
export type ProductsFilter = z.infer<typeof ProductsFilterSchema>;

@Service()
export class ProductsApiService {
  readonly #path = getAppParams('apiPath') + 'products/';
  #http = inject(HttpClient);

  productsResource(filter: Signal<ProductsFilter | undefined>): HttpResourceRef<ProductPartial[]> {
    const query = httpFilterSignal(ProductsFilterSchema, filter);

    return httpResource(() => httpResponseRequest(this.#path, query().cacheable()), {
      defaultValue: [],
      parse: validatorFn(ProductSchema.array()),
      equal: isEqual,
    });
  }

  productResource(id: Signal<ProductsFilter | undefined>): HttpResourceRef<Product | undefined> {
    return httpResource(() => (id() ? httpResponseRequest(this.#path + id()) : undefined), {
      parse: validatorFn(ProductSchema),
      equal: isEqual,
    });
  }

  productByNameResource(name: Signal<string | undefined>): HttpResourceRef<Product | undefined> {
    return httpResource(() => (name() ? httpResponseRequest(this.#path + 'name/' + name()) : undefined), {
      parse: validatorFn(ProductSchema),
      equal: isEqual,
    });
  }

  getProducts(filter: ProductsFilter): Observable<ProductPartial[]> {
    const query = ProductsFilterSchema.encode(filter);
    const data$ = this.#http.get(this.#path, cacheable(query));
    return data$.pipe(map(validatorFn(ProductPartial.array())));
  }

  getOne(id: string): Promise<Product> {
    const data$ = this.#http.get(this.#path + id).pipe(map(validatorFn(ProductSchema)));
    return firstValueFrom(data$);
  }

  getOneByName(name: string): Promise<Product> {
    const data$ = this.#http.get(this.#path + 'name/' + name).pipe(map(validatorFn(ProductSchema)));
    return firstValueFrom(data$);
  }

  deleteOne(id: string): Promise<number> {
    const data$ = this.#http.delete(this.#path + id).pipe(pluckDeletedCount());
    return firstValueFrom(data$);
  }

  updateOne(id: string, data: Partial<Product>): Promise<Product> {
    const update$ = this.#http.patch(this.#path + id, data).pipe(map(validatorFn(ProductSchema)));
    return firstValueFrom(update$);
  }

  insertOne(data: Partial<Product>): Promise<Product> {
    const update$ = this.#http.put<Record<string, unknown>>(this.#path, data).pipe(map(validatorFn(ProductSchema)));
    return firstValueFrom(update$);
  }

  validatorData<K extends keyof Product & string>(key: K): Promise<Product[K][]> {
    return firstValueFrom(this.#http.get<Product[K][]>(this.#path + 'validate/' + key, cacheable()));
  }

  productsCustomerResource(name: Signal<string | undefined>): HttpResourceRef<CustomerProduct[] | undefined> {
    return httpResource(() => (name() ? httpResponseRequest(this.#path + 'prices/customer/' + name()) : undefined), {
      parse: validatorFn(CustomerProductSchema.array()),
      equal: isEqual,
    });
  }

  productsCustomer(customer: string): Observable<CustomerProduct[]> {
    return this.#http
      .get(this.#path + 'prices/customer/' + customer, cacheable())
      .pipe(map(validatorFn(CustomerProductSchema.array())));
  }

  productionStages(productName: string): Promise<ProductProductionStage[]> {
    const data$ = this.#http
      .get<Record<string, unknown>[]>(this.#path + productName + '/productionStages', cacheable())
      .pipe(map(validatorFn(ProductProductionStage.array())));
    return firstValueFrom(data$);
  }
}
