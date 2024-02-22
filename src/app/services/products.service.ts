import { Injectable } from '@angular/core';
import { cacheWithUpdate } from 'src/app/library/rxjs';
import {
  catchError,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import {
  CustomerProduct,
  JobProductionStage,
  NewProduct,
  Product,
  ProductPartial,
} from 'src/app/interfaces';
import { getConfig } from 'src/app/services/config.provider';
import { ProductsApiService } from 'src/app/services/prd-api/products-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  readonly categories$ = getConfig('jobs', 'productCategories');

  private readonly _updateProducts$: Subject<void> = new Subject();
  private readonly _updateOneProduct$: Subject<ProductPartial> = new Subject();

  products$: Observable<ProductPartial[]> = this._updateProducts$.pipe(
    startWith({}),
    switchMap(() => this.api.getAll()),
    cacheWithUpdate(this._updateOneProduct$, (o1, o2) => o1._id === o2._id),
    shareReplay(1)
  );

  constructor(private api: ProductsApiService) { }

  get activeProducts$(): Observable<ProductPartial[]> {
    return this.products$.pipe(
      map((prod) => prod.filter((pr) => !pr.inactive))
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.api.getOne(id);
  }

  getProductByName(name: string): Observable<Product> {
    return this.api.getOneByName(name);
  }

  updateProduct({ _id, ...rest }: Partial<Product>): Observable<Product> {
    return this.api
      .updateOne(_id, rest)
      .pipe(tap((resp) => this._updateOneProduct$.next(resp)));
  }

  deleteProduct(id: string): Observable<boolean> {
    return this.api.deleteOne(id).pipe(
      tap(() => this._updateProducts$.next()),
      map((_) => true)
    );
  }

  insertProduct(prod: NewProduct): Observable<Product> {
    return this.api
      .insertOne(prod)
      .pipe(tap((_) => this._updateProducts$.next()));
  }

  validate<K extends keyof Product>(
    key: K,
    value: Product[K]
  ): Observable<boolean> {
    return this.api
      .validatorData(key)
      .pipe(map((values) => !values.includes(value)));
  }

  productsCustomer(customer: string): Observable<CustomerProduct[]> {
    return this.api.productsCustomer(customer).pipe(catchError(() => of([])));
  }

  productionStages(product: string): Observable<JobProductionStage[]> {
    return this.api.productionStages(product);
  }
}
