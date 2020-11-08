import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Product } from 'src/app/interfaces';
import { SimpleFormResolverService, RetrieveFn } from 'src/app/library/simple-form';
import { ProductsService } from 'src/app/services';

@Injectable()
export class ProductsResolverService implements Resolve<Product> {

  constructor(
    private productService: ProductsService,
    private simpleResolver: SimpleFormResolverService,
  ) { }

  private retrieveFnFactory(id: string): RetrieveFn<Product> {
    return () => {
      if (!id || id.length !== 24) { return of(null); }
      return this.productService.getProduct(id);
    };
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> | Observable<never> | undefined {
    const id: string = route.paramMap.get('id');
    return this.simpleResolver.retrieve(state, this.retrieveFnFactory(id));

  }

}
