import { Injectable } from '@angular/core';
import { Observable, merge, Subject, EMPTY, of, observable } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay } from 'rxjs/operators';
import { Product, CustomerProduct } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services';

@Injectable()
export class ProductsService {
  private readonly httpPath = '/data/products/';

  constructor(
    private prdApi: PrdApiService,
  ) { }

  product(id: string): Observable<Product> {
    return this.prdApi.products.get(id);
  }

  productsCustomer(customer: string): Observable<CustomerProduct[]> {
    return this.prdApi.products.productsCustomer(customer);
  }
}
