import { Injectable } from '@angular/core';
import { Customer, CustomerPartial } from 'src/app/interfaces';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { PrdApiService } from 'src/app/services';

@Injectable()
export class CustomersService {

  constructor(
    private prdApi: PrdApiService,
  ) { }

  /** klientu saraksts */
  get customers$(): Observable<CustomerPartial[]> {
    return this.prdApi.customers.get();
  }

  getCustomer(id: string): Observable<Customer | null> {
    return this.prdApi.customers.get(id);
  }
}
