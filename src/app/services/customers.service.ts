import { Injectable } from '@angular/core';
import { Observable, merge, Subject, EMPTY, of } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay, startWith } from 'rxjs/operators';
import { Customer, CustomerPartial, CustomerUpdate, NewCustomer } from 'src/app/interfaces';
import { CustomersApiService } from './prd-api/customers-api.service';


@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private reloadCustomers$: Subject<void> = new Subject();

  customers$: Observable<CustomerPartial[]> = this.reloadCustomers$.pipe(
    startWith({}),
    switchMap(() => this.getCustomerList()),
    shareReplay(1),
  );

  constructor(
    private api: CustomersApiService,
  ) { }

  updateCustomer({ _id, ...rest }: CustomerUpdate): Observable<Customer> {
    return this.api.updateOne(_id, rest).pipe(
      tap(() => this.reloadCustomers$.next()),
    );
  }

  getCustomerList(filter: { name?: string, email?: string; } = {}): Observable<CustomerPartial[]> {
    return this.api.getAll({ disabled: true, ...filter });
  }

  getCustomer(id: string): Observable<Customer | never> {

    this.isValidId(id);
    return this.api.getOne(id);

  }

  getCustomerByName(name: string): Observable<Customer> {
    return this.api.getOne(name);
  }

  deleteCustomer(id: string): Observable<boolean> {

    this.isValidId(id);
    return this.api.deleteOne(id).pipe(
      tap(() => this.reloadCustomers$.next()),
    );
  }

  saveNewCustomer(customer: NewCustomer): Observable<string> {
    return this.api.insertOne(customer).pipe(
      tap(_ => this.reloadCustomers$.next()),
      pluck('_id'),
    );
  }

  validator<K extends keyof Customer>(key: K, value: Customer[K]): Observable<boolean> {
    if (!value) {
      return of(false);
    }
    const str = value?.toString().toUpperCase();
    return this.api.validatorData(key).pipe(
      map(values => values.map(val => val.toString().toUpperCase())),
      map(values => !values.includes(str)),
    );
  }

  private isValidId(str: any): asserts str is string {
    if (!(/^[a-f\d]{24}$/i).test(str)) {
      throw new Error(`Invalid id ${str}`);
    }
  }

}
