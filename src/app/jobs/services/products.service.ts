import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from 'src/app/library/http/http-options';
import { Observable, merge, Subject, EMPTY, of, observable } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay } from 'rxjs/operators';
import { ProductResult, Product, ProductPartial, CustomerProduct } from '../interfaces';
import { LoginService } from 'src/app/login/login.service';
import { JobsSettings } from 'src/app/library/classes/system-preferences-class';

@Injectable()
export class ProductsService {
  private readonly httpPath = '/data/products/';

  constructor(
    private http: HttpClient,
  ) { }


  public get products$(): Observable<ProductPartial[]> {
    return this.http.get<ProductResult>(this.httpPath, new HttpOptions().cacheable())
      .pipe(
        pluck('products'),
      );
  }


  productsCategory(category: string): Observable<ProductPartial[]> {
    return this.http.get<ProductResult>(this.httpPath + 'category/' + category, new HttpOptions().cacheable())
      .pipe(
        pluck('products'),
      );
  }

  product(id: string): Observable<Product> {
    return this.http.get<ProductResult>(this.httpPath + id, new HttpOptions().cacheable())
      .pipe(
        pluck('product'),
      );
  }

  productsCustomer(customer: string): Observable<CustomerProduct[]> {
    return this.http.get<ProductResult>(
      this.httpPath + 'prices/customer/' + customer,
      new HttpOptions().cacheable(),
    ).pipe(
      pluck('customerProducts')
    );
  }
}
