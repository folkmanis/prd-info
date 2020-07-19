import { Injectable } from '@angular/core';
import { Observable, merge, Subject, EMPTY } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay, startWith } from 'rxjs/operators';
import { Customer, CustomerPartial, CustomerResponse } from 'src/app/interfaces';

import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';


@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private updateCustomers$: Subject<void> = new Subject();
  private _customers$: Observable<CustomerPartial[]>;

  constructor(
    private prdApi: PrdApiService,
  ) { }

  get customers$(): Observable<CustomerPartial[]> {
    if (!this._customers$) {
      this._customers$ = this.updateCustomers$.pipe(
        startWith({}),
        switchMap(() => this.getCustomerList()),
        shareReplay(1),
      );
    }
    return this._customers$;
  }

  updateCustomer(customer: Partial<Customer>): Observable<boolean> {
    const _id = customer._id;
    delete customer._id;
    return this.prdApi.customers.updateOne(_id, customer).pipe(
      tap(() => this.updateCustomers$.next()),
    );
  }

  getCustomerList(): Observable<CustomerPartial[]> {
    return this.prdApi.customers.get({ disabled: false });
  }

  getCustomer(id: string): Observable<Customer | never> {
    return (/^[a-f\d]{24}$/i).test(id) ? this.prdApi.customers.get(id) : EMPTY;
  }

  getCustomerByName(name: string): Observable<Customer> {
    return this.prdApi.customers.get(name);
  }

  deleteCustomer(id: string): Observable<boolean> {
    return this.prdApi.customers.deleteOne(id).pipe(
      tap(() => this.updateCustomers$.next()),
      map(resp => !!resp),
    );
  }

  saveNewCustomer(customer: Customer): Observable<string | null> {
    return this.prdApi.customers.insertOne(customer).pipe(
      map(resp => resp ? resp.toString() : null),
      tap(() => this.updateCustomers$.next()),
    );
  }

  validator<K extends keyof Customer>(key: K, value: Customer[K]): Observable<boolean> {
    return this.prdApi.customers.validatorData(key).pipe(
      map(values => !values.includes(value))
    );
  }

}
