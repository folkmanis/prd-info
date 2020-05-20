import { Injectable } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { map, share, switchMap, tap } from 'rxjs/operators';
import { Customer, Product, ProductNoPrices } from 'src/app/interfaces';
import { JobsSettings } from 'src/app/interfaces';
import { LoginService } from 'src/app/login/login.service';
import { PrdApiService } from 'src/app/services';

@Injectable()
export class ProductsService {

  constructor(
    private loginService: LoginService,
    private prdApi: PrdApiService,
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
    return this.prdApi.products.get(id);
  }

  updateProduct(id: string, prod: Partial<Product>): Observable<boolean> {
    return this.prdApi.products.updateOne(id, prod).pipe(
      this.updateProducts(() => this.getAllProducts(), this._updateProducts$),
    );
  }

  deleteProduct(id: string): Observable<boolean> {
    return this.prdApi.products.deleteOne(id).pipe(
      this.updateProducts(() => this.getAllProducts(), this._updateProducts$),
      map(count => !!count),
    );
  }

  insertProduct(prod: ProductNoPrices): Observable<string> {
    return this.prdApi.products.insertOne(prod).pipe(
      this.updateProducts(() => this.getAllProducts(), this._updateProducts$),
      map(id => id.toString()),
    );
  }

  validate<K extends keyof Product>(key: K, value: Product[K]): Observable<boolean> {
    return this.prdApi.products.validatorData(key).pipe(
      map(values => !values.includes(value)),
    );
  }

  getAllCustomers(): Observable<Partial<Customer[]>> {
    return this.prdApi.customers.get();
  }

  getAllProducts(): Observable<Pick<Product, '_id' | 'name' | 'category'>[]> {
    return this.prdApi.products.get();
  }

  private updateProducts<K, U>(
    updateFunc: () => Observable<K>,
    emiter: Subject<K>
  ): (obs: Observable<U>) => Observable<U> {
    let value: U;
    return (obs: Observable<U>): Observable<U> => {
      return obs.pipe(
        tap(val => value = val),
        switchMap(updateFunc),
        tap(upd => emiter.next(upd)),
        map(() => value),
      );
    };
  }

}
