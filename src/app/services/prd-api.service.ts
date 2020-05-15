import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, merge, Subject, of } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay } from 'rxjs/operators';
import { HttpOptions, AppHttpResponseBase } from 'src/app/library';
import {
  Customer,
  Product, ProductResult, CustomerProduct, ProductTotals,
  Job,
  Invoice, InvoiceResponse
} from '../interfaces';


interface CustomerProductPrice {
  customerName: string;
  product: string;
  price?: number | null;
}

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
  jobs = new JobsApi(this.http);
  invoices = new InvoicesApi(this.http);

}

abstract class ApiBase<T> {
  protected abstract get path(): string;
  constructor(
    protected http: HttpClient,
  ) { }

  get<P = Partial<T>>(params?: { [key: string]: any; }): Observable<P[]>;
  get<P = Partial<T>>(id: string | number, params?: { [key: string]: any; }): Observable<T>;
  get<P = Partial<T>>(
    idOrParams?: string | number | { [key: string]: any; },
    params?: { [key: string]: any; }
  ): Observable<P[]> | Observable<T> {

    if (idOrParams && idOrParams instanceof Object) {
      return this.http.get<AppHttpResponseBase<T>>(this.path, new HttpOptions(idOrParams).cacheable()).pipe(
        map(resp => resp.data as P[])
      );
    }
    if (idOrParams) {
      return this.http.get<AppHttpResponseBase<T>>(this.path + idOrParams, new HttpOptions(params).cacheable()).pipe(
        map(resp => resp.data as T)
      );
    }
    return this.http.get<AppHttpResponseBase<T>>(this.path, new HttpOptions().cacheable()).pipe(
      map(resp => resp.data as P[])
    );
  }

  delete(id: string | number): Observable<number> {
    return this.http.delete<AppHttpResponseBase<T>>(this.path + id, new HttpOptions()).pipe(
      map(resp => resp.deletedCount || 0),
    );
  }

  updateOne(id: string | number, data: Partial<T>): Observable<boolean> {
    return this.http.post<AppHttpResponseBase<T>>(this.path + id, data, new HttpOptions()).pipe(
      map(resp => !!resp.modifiedCount)
    );
  }

  insertOne(data: Partial<T>): Observable<string | number | null> {
    return this.http.put<AppHttpResponseBase<T>>(this.path, data, new HttpOptions()).pipe(
      map(resp => resp.error ? null : resp.insertedId),
    );
  }

  validatorData<K extends keyof T>(key: K): Observable<T[keyof T][]> {
    return this.http.get<AppHttpResponseBase<T>>(this.path + 'validate/' + key, new HttpOptions().cacheable()).pipe(
      map((values) => values.validatorData),
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

  productsCustomer(customer: string): Observable<CustomerProduct[]> {
    return this.http.get<ProductResult>(
      this.path + 'prices/customer/' + customer,
      new HttpOptions().cacheable(),
    ).pipe(
      map(resp => resp.customerProducts)
    );

  }
  /** Preču cenas vairākiem klientu un preču */
  customersProducts(customerProducts: CustomerProductPrice[]): Observable<CustomerProductPrice[]> {
    return this.http.get<{ data: CustomerProductPrice[]; }>(
      this.path + 'prices/customers',
      new HttpOptions({ filter: JSON.stringify(customerProducts) })
    ).pipe(
      map(resp => resp.data)
    );
  }

}

class JobsApi extends ApiBase<Job> {
  protected get path(): string {
    return HTTP_PATH + 'jobs/';
  }

  importJobs(data: any): Observable<number> {
    return this.http.post<ProductResult>(this.path + 'jobimport', data, new HttpOptions()).pipe(
      map(resp => resp.modifiedCount)
    );
  }

}

class InvoicesApi extends ApiBase<Invoice> {
  protected get path(): string {
    return HTTP_PATH + 'invoices/';
  }

  createInvoice(params: { selectedJobs: number[], customerId: string; }): Observable<Invoice> {
    return this.http.post<InvoiceResponse>(this.path, params, new HttpOptions()).pipe(
      map(resp => resp.data as Invoice)
    );
  }

  getTotals(jobsId: number[]): Observable<ProductTotals[]> {
    return this.http.get<InvoiceResponse>(this.path + 'totals', new HttpOptions({ jobsId })).pipe(
      map(resp => resp.totals),
    );

  }


}
