import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Product } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services/products.service';

export const resolveProduct: ResolveFn<Product> = async (route) => {
  const router = inject(Router);
  try {
    return await inject(ProductsService).getProduct(route.paramMap.get('id'));
  } catch (error) {
    return new RedirectCommand(router.parseUrl('/jobs-admin/products'));
  }
}

