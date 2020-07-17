import { Injectable } from '@angular/core';
import { merge, Observable, Subject, MonoTypeOperatorFunction } from 'rxjs';
import { map, share, shareReplay, switchMap, tap, startWith, concatMap, filter } from 'rxjs/operators';
import { Product, ProductNoPrices, ProductPartial, CustomerProduct } from 'src/app/interfaces';
import { cacheWithUpdate } from 'src/app/library/rx';
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

  private _products$: Observable<ProductPartial[]>;
  readonly categories$ = this.systemPreferencesService.sysPreferences$.pipe(
    map(sysPref => sysPref.get('jobs') as JobsSettings),
    map(js => js.productCategories),
    share(),
  );

  private readonly _updateProducts$: Subject<void> = new Subject();
  private readonly _updateOneProduct$: Subject<ProductPartial> = new Subject();

  get products$(): Observable<ProductPartial[]> {
    if (!this._products$) {
      this._products$ = this._updateProducts$.pipe(
        startWith({}),
        switchMap(() => this.prdApi.products.get<ProductPartial>()),
        cacheWithUpdate(
          this._updateOneProduct$,
          (o1, o2) => o1._id === o2._id
        ),
        shareReplay(1),
      );
    }
    return this._products$;
  }

  get activeProducts$(): Observable<ProductPartial[]> {
    return this.products$.pipe(
      map(prod => prod.filter(pr => !pr.inactive))
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.prdApi.products.get(id);
  }

  updateProduct(id: string, prod: Partial<Product>): Observable<boolean> {
    return this.prdApi.products.updateOne(id, prod).pipe(
      concatMap(result => this.prdApi.products.get(id).pipe(
        tap(resp => this._updateOneProduct$.next(resp)),
        map(_ => result),
      )),
    );
  }

  deleteProduct(id: string): Observable<boolean> {
    return this.prdApi.products.deleteOne(id).pipe(
      tap(() => this._updateProducts$.next()),
      map(count => !!count),
    );
  }

  insertProduct(prod: ProductNoPrices): Observable<string> {
    return this.prdApi.products.insertOne(prod).pipe(
      tap(() => this._updateProducts$.next()),
      map(id => id.toString()),
    );
  }

  validate<K extends keyof Product>(key: K, value: Product[K]): Observable<boolean> {
    return this.prdApi.products.validatorData(key).pipe(
      map(values => !values.includes(value)),
    );
  }

  productsCustomer(customer: string): Observable<CustomerProduct[]> {
    return this.prdApi.products.productsCustomer(customer);
  }

}
