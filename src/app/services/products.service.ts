import { Injectable, Inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { concatMap, map, pluck, share, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { CustomerProduct, Product, ProductPartial, SystemPreferences } from 'src/app/interfaces';
import { cacheWithUpdate } from 'src/app/library/rx';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { CONFIG } from 'src/app/services/config.provider';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private prdApi: PrdApiService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }

  private _products$: Observable<ProductPartial[]>;
  readonly categories$ = this.config$.pipe(
    pluck('jobs', 'productCategories'),
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
          (o1, o2) => o1.name === o2.name
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

  updateProduct({ name, ...rest }: Product): Observable<boolean> {
    return this.prdApi.products.updateOne(name, rest).pipe(
      concatMap(result => this.prdApi.products.get(name).pipe(
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

  insertProduct(prod: Product): Observable<string> {
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
