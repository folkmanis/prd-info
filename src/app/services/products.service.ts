import { Injectable, Inject } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, concatMap, map, mapTo, pluck, share, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { CustomerProduct, JobProductionStage, Product, ProductPartial, SystemPreferences } from 'src/app/interfaces';
import { cacheWithUpdate } from 'prd-cdk';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { CONFIG } from 'src/app/services/config.provider';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  readonly categories$ = this.config$.pipe(
    pluck('jobs', 'productCategories'),
  );
  private _products$: Observable<ProductPartial[]>;

  private readonly _updateProducts$: Subject<void> = new Subject();
  private readonly _updateOneProduct$: Subject<ProductPartial> = new Subject();

  constructor(
    private prdApi: PrdApiService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }

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

  updateProduct({ name, ...rest }: Product): Observable<Product> {
    return this.prdApi.products.updateOne(name, rest).pipe(
      tap(resp => this._updateOneProduct$.next(resp)),
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
      tap(_ => this._updateProducts$.next()),
      map(id => id.name),
    );
  }

  validate<K extends keyof Product>(key: K, value: Product[K]): Observable<boolean> {
    return this.prdApi.products.validatorData(key).pipe(
      map(values => !values.includes(value)),
    );
  }

  productsCustomer(customer: string): Observable<CustomerProduct[]> {
    return this.prdApi.products.productsCustomer(customer).pipe(
      catchError(() => of([])),
    );
  }

  productionStages(product: string): Observable<JobProductionStage[]> {
    return this.prdApi.products.productionStages(product);
  }

}
