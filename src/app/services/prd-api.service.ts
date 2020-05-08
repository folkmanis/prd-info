import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, merge, Subject } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay } from 'rxjs/operators';

import { HttpOptions, AppHttpResponseBase } from 'src/app/library';

import { Customer, Product } from '../interfaces';

const HTTP_PATH = '/data/';

@Injectable({
  providedIn: 'root'
})
export class PrdApiService {

  constructor(
    private http: HttpClient
  ) { }

  customers = new CustomersApi(this.http);

  products = new ProductsApi(this.http);

}

abstract class ApiBase<T> {
  protected abstract get path(): string;
  constructor(
    protected http: HttpClient,
  ) { }

  get(params?: { [key: string]: any; }): Observable<Partial<T>[]>;
  get(id: string | number, params?: { [key: string]: any; }): Observable<T>;
  get(idOrParams?: string | number | { [key: string]: any; }, params?: { [key: string]: any; }): Observable<Partial<T>[]> | Observable<T> {
    if (idOrParams && idOrParams instanceof Object) {
      return this.http.get<AppHttpResponseBase<T>>(this.path, new HttpOptions(idOrParams).cacheable()).pipe(
        map(resp => resp.data as Partial<T>[])
      );
    }
    if (idOrParams) {
      return this.http.get<AppHttpResponseBase<T>>(this.path + idOrParams, new HttpOptions(params).cacheable()).pipe(
        map(resp => resp.data as T)
      );
    }
    return this.http.get<AppHttpResponseBase<T>>(this.path, new HttpOptions().cacheable()).pipe(
      map(resp => resp.data as Partial<T>[])
    );
  }

  delete(id: string | number): Observable<number> {
    return this.http.delete<AppHttpResponseBase<T>>(this.path + id, new HttpOptions()).pipe(
      map(resp => resp.deletedCount || 0),
    );
  }

  updateOne(id: string | number, data: Partial<T>): Observable<boolean> {
    return this.http.post<AppHttpResponseBase<T>>(this.path + id, data, new HttpOptions()).pipe(
      map(resp => !resp.modifiedCount)
    );
  }

  insertOne(data: Partial<T>): Observable<string | number | null> {
    return this.http.put<AppHttpResponseBase<T>>(this.path, data, new HttpOptions()).pipe(
      map(resp => resp.error ? null : resp.insertedId),
    );
  }

  validatorData<K extends keyof T>(key: K): Observable<K[]> {
  return this.http.get<AppHttpResponseBase<T>>(this.path + 'validate/' + key, new HttpOptions().cacheable()).pipe(
      map((values) => values.validatorData as K[]),
  );
}

}

class CustomersApi extends ApiBase<Customer> {

  protected get path(): string {
    return HTTP_PATH + 'customers/';
  }

}

class ProductsApi extends ApiBase<Product> {
  protected get path(): string {
    return HTTP_PATH + 'products/';
  }

}
