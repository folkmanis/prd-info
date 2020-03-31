import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from "src/app/library/http/http-options";
import { Observable, merge, Subject } from 'rxjs';
import { map, pluck, filter, tap, switchMap,share, shareReplay } from 'rxjs/operators';
import { Customer } from './customer';

type CustomerPartial = Pick<Customer, '_id' | 'CustomerName' | 'code'>;
interface Result { n: number, ok: number; };
interface NewCustomerResult {
  insertedId: string,
  result: {
    n: number,
    ok: number;
  },
  error: boolean;
}

@Injectable()
export class CustomersService {
  private httpPath = '/data/customers/';
  private updateCustomers$: Subject<CustomerPartial[]> = new Subject();
  constructor(
    private http: HttpClient,
  ) { }

  customers$: Observable<CustomerPartial[]> = merge(
    this.updateCustomers$, this.getCustomerList()
  ).pipe(
    share(),
  );

  updateCustomer(customer: Partial<Customer>): Observable<boolean> {
    return this.http.post<{ result: Result; }>(this.httpPath + 'update', customer, new HttpOptions()).pipe(
      map(resp => !!resp.result.ok)
    );
  }

  getCustomerList(): Observable<CustomerPartial[]> {
    return this.http.get<{ customers: CustomerPartial[]; }>(this.httpPath, new HttpOptions).pipe(
      pluck('customers')
    );
  }

  getCustomer(id: string): Observable<Customer | null> {
    return this.http.get<{ customer: Customer | null; }>(this.httpPath + id, new HttpOptions()).pipe(
      pluck('customer'),
    );
  }

  deleteCustomer(id: string): Observable<CustomerPartial[]> {
    return this.http.delete<{ result: Result; }>(this.httpPath + id, new HttpOptions()).pipe(
      pluck('result'),
      map(result => result.ok > 0 && result.n > 0),
      filter(result => result),
      switchMap(() => this.getCustomerList()),
      tap(cust => this.updateCustomers$.next(cust)),
    );
  }

  saveCustomer(customer: Customer): Observable<string | null> {
    return this.http.put<NewCustomerResult>(this.httpPath + 'new', customer, new HttpOptions()).pipe(
      map(resp => resp.error || !resp.result.ok ? null : resp.insertedId),
    );
  }

  validator(value: { code?: string, CustomerName?: string; }): Observable<boolean> {
    return this.http.get<boolean>(this.httpPath + 'validate', new HttpOptions(value));
  }
}
