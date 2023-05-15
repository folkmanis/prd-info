import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { EMPTY, mergeMap, of } from 'rxjs';
import { Product } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services/products.service';

export const resolveProduct: ResolveFn<Product> = (route) =>
  inject(ProductsService).getProduct(route.paramMap.get('id'))
    .pipe(
      mergeMap(product => product ? of(product) : EMPTY)
    );
