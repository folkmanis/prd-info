import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from 'src/app/library/http/http-options';
import { Customer, CustomerResponse, CustomerPartial } from '../interfaces';
import { Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';

@Injectable()
export class CustomersService {
  private readonly httpPath = '/data/customers/';

  constructor(
    private http: HttpClient,
  ) { }

  /** klientu saraksts */
  get customers$(): Observable<CustomerPartial[]> {
    return this.http.get<CustomerResponse>(this.httpPath, new HttpOptions().cacheable())
      .pipe(
        pluck('customers')
      );
  }

  getCustomer(id: string): Observable<Customer | null> {
    return this.http.get<CustomerResponse>(this.httpPath + id, new HttpOptions().cacheable())
      .pipe(
        pluck('customer'),
      );
  }
}
