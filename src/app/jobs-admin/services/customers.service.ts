import { Injectable } from '@angular/core';
import { Observable, merge, Subject } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay } from 'rxjs/operators';
import { Customer, CustomerPartial, CustomerResponse } from 'src/app/interfaces';

import { PrdApiService } from 'src/app/services';


@Injectable()
export class CustomersService {
  private updateCustomers$: Subject<CustomerPartial[]> = new Subject();

  constructor(
    private prdApi: PrdApiService,
  ) { }

  customers$: Observable<Partial<Customer>[]> = merge(
    this.updateCustomers$, this.getCustomerList()
  ).pipe(
    share(),
  );

  updateCustomer(customer: Partial<Customer>): Observable<boolean> {
    const _id = customer._id;
    delete customer._id;
    return this.prdApi.customers.updateOne(_id, customer);
  }

  getCustomerList(): Observable<CustomerPartial[]> {
    return this.prdApi.customers.get({ disabled: false });
  }

  getCustomer(id: string): Observable<Customer | null> {
    return this.prdApi.customers.get(id);
  }

  deleteCustomer(id: string): Observable<boolean> {
    return this.prdApi.customers.delete(id).pipe(
      map(result => result > 0),
      this.reloadCustomers(() => this.getCustomerList(), this.updateCustomers$),
    );
  }

  saveNewCustomer(customer: Customer): Observable<string | null> {
    return this.prdApi.customers.insertOne(customer).pipe(
      map(resp => resp ? resp.toString() : null)
    );
  }

  validator<K extends keyof Customer>(key: K, value: Customer[K]): Observable<boolean> {
    return this.prdApi.customers.validatorData(key).pipe(
      map(values => !values.includes(value))
    );
  }

  private reloadCustomers<T, K>(updateFunc: () => Observable<K>, emiter: Subject<K>): (src: Observable<T>) => Observable<T> {
    let value: T;
    return (src: Observable<T>): Observable<T> => {
      return src.pipe(
        tap(val => value = val),
        switchMap(updateFunc),
        tap(cust => emiter.next(cust)),
        map(() => value),
      );
    };
  }
}
