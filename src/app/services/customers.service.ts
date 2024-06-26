import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable, of, Subject } from 'rxjs';
import { map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { Customer, CustomerPartial, CustomerUpdate, NewCustomer } from 'src/app/interfaces';
import { CustomersApiService } from './prd-api/customers-api.service';


@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private api = inject(CustomersApiService);

  private reloadCustomers$: Subject<void> = new Subject();

  customers$: Observable<CustomerPartial[]> = this.reloadCustomers$.pipe(
    startWith({}),
    switchMap(() => this.getCustomerList()),
    shareReplay(1),
  );

  async updateCustomer({ _id, ...rest }: CustomerUpdate): Promise<Customer> {
    const update = await firstValueFrom(this.api.updateOne(_id, rest));
    this.reloadCustomers$.next();
    return update;
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

  async saveNewCustomer(customer: NewCustomer): Promise<Customer> {
    const update = await firstValueFrom(this.api.insertOne(customer));
    this.reloadCustomers$.next();
    return update;
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
