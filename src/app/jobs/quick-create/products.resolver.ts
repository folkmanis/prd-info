import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductPartial } from 'src/app/interfaces/product';
import { resolveCatching } from 'src/app/library/guards';
import { ProductsService } from 'src/app/services/products.service';

export const productsResolver: ResolveFn<ProductPartial[]> = (_, state) => {
  return resolveCatching(state.url, () => inject(ProductsService).getProducts({ disabled: false }));
};
