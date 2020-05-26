import { Injectable } from '@angular/core';
import { merge, Observable, Subject } from 'rxjs';
import { map, share, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Product, ProductNoPrices, CustomerProduct, SystemPreferencesGroups } from 'src/app/interfaces';
import { JobsSettings } from 'src/app/interfaces';
import { SystemPreferencesService } from 'src/app/services/system-preferences.service';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private prdApi: PrdApiService,
    private systemPreferencesService: SystemPreferencesService,
  ) { }

  private _products$: Observable<ProductNoPrices[]>;
  readonly categories$ = this.systemPreferencesService.sysPreferences$.pipe(
    map(sysPref => sysPref.get('jobs') as JobsSettings),
    map(js => js.productCategories),
    share(),
  );

  private readonly _updateProducts$: Subject<Pick<Product, '_id' | 'name' | 'category'>[]> = new Subject();

  get products$(): Observable<ProductNoPrices[]> {
    if (!this._products$) {
      this._products$ = merge(
        this.getAllProducts(),
        this._updateProducts$
      ).pipe(
        shareReplay(1)
      );
    }
    return this._products$;
  }

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

  getAllProducts(): Observable<Pick<Product, '_id' | 'name' | 'category'>[]> {
    return this.prdApi.products.get();
  }

  productsCustomer(customer: string): Observable<CustomerProduct[]> {
    return this.prdApi.products.productsCustomer(customer);
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
