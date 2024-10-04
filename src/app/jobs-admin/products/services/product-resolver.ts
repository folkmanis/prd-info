import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Product } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services/products.service';

export const resolveProduct: ResolveFn<Product> = async (route) => {
  const router = inject(Router);
  const productsService = inject(ProductsService);
  const idOrName = route.paramMap.get('id');

  const regex = /^[0-9A-Fa-f]{24}$/;

  try {
    if (regex.test(idOrName)) {
      return await productsService.getProduct(idOrName);
    } else {
      return await productsService.getProductByName(idOrName);
    }
  } catch (error) {
    return new RedirectCommand(router.parseUrl('/jobs-admin/products'));
  }
};
