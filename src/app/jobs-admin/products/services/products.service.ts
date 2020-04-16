import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpOptions } from 'src/app/library/http/http-options';
import { Observable, merge, Subject, EMPTY, of, observable } from 'rxjs';
import { map, pluck, filter, tap, switchMap, share, shareReplay } from 'rxjs/operators';
import { ProductResult, ProductNoPrices } from './product';
import { Product } from '../../services/jobs-admin.interfaces';
import { LoginService } from 'src/app/login/login.service';
import { JobsSettings } from 'src/app/library/classes/system-preferences-class';
import { Customer } from '../../services/jobs-admin.interfaces';

@Injectable()
export class ProductsService {
  private readonly httpPath = '/data/products/';
  private readonly httpCustomerPath = '/data/customers/';

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
  ) { }

  readonly categories$ = this.loginService.sysPreferences$.pipe(
    map(sysPref => sysPref.get('jobs') as JobsSettings),
    map(js => js.productCategories),
    share(),
  );

  private readonly _updateProducts$: Subject<Pick<Product, '_id' | 'name' | 'category'>[]> = new Subject();

  readonly products$ = merge(this.getAllProducts(), this._updateProducts$).pipe(
    share()
  );

  getProduct(id: string): Observable<Product> {
    return this.http.get<ProductResult>(this.httpPath + id, new HttpOptions().cacheable()).pipe(
      map(res => res.product)
    );
  }

  updateProduct(id: string, prod: Partial<Product>): Observable<boolean> {
    return this.http.post<ProductResult>(this.httpPath + id, prod, new HttpOptions()).pipe(
      this.updateProducts(() => this.getAllProducts(), this._updateProducts$),
      map(() => true),
    );
  }

  deleteProduct(id: string): Observable<boolean> {
    return this.http.delete<ProductResult>(this.httpPath + id).pipe(
      this.updateProducts(() => this.getAllProducts(), this._updateProducts$),
      map(() => true),
    );
  }

  insertProduct(prod: ProductNoPrices): Observable<string> {
    return this.http.put<ProductResult>(this.httpPath, prod, new HttpOptions()).pipe(
      this.updateProducts(() => this.getAllProducts(), this._updateProducts$),
      map(res => res.insertedId),
    );
  }

  validate(key: string, value: any): Observable<boolean> {
    return this.http.get<ProductResult>(this.httpPath + 'validate/' + key, new HttpOptions().cacheable()).pipe(
      pluck(key),
      map((values: any[]) => !values.includes(value)),
    );
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<{ customers: Customer[]; }>(this.httpCustomerPath, new HttpOptions().cacheable()).pipe(
      pluck('customers'),
    );
  }

  private getAllProducts(): Observable<Pick<Product, '_id' | 'name' | 'category'>[]> {
    return this.http.get<ProductResult>(this.httpPath, new HttpOptions()).pipe(
      filter(res => !res.error),
      map(res => res.products),
    );
  }

  private updateProducts<K>(
    updateFunc: () => Observable<K>,
    emiter: Subject<K>
  ): (obs: Observable<ProductResult>) => Observable<ProductResult> {
    let value: ProductResult;
    return (obs: Observable<ProductResult>): Observable<ProductResult> => {
      return obs.pipe(
        filter(res => !res.error),
        tap(val => value = val),
        switchMap(updateFunc),
        tap(upd => emiter.next(upd)),
        map(() => value),
      );
    };
  }

}
