import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Resolve } from '@angular/router';
import { ProductsService } from 'src/app/services';
import { Product, ProductPrice } from 'src/app/interfaces';
import { mergeMap } from 'rxjs/operators';


@Injectable()
export class ProductsResolverService implements Resolve<Product> {

  constructor(
    private productService: ProductsService,
    private router: Router,
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product> | Observable<never> | undefined {
    const id: string = route.paramMap.get('id');
    if (!id || id.length !== 24) {
          this.router.navigate(['jobs-admin', 'products']);
      return;
    }
    return this.productService.getProduct(id).pipe(
      mergeMap(product => {
        if (product) {
          return of(product);
        } else {
          this.router.navigate(['jobs-admin', 'products']);
          return EMPTY;
        }
      })
    );

  }

}
