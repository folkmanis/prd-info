import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { Product } from 'src/app/interfaces';
import { RetrieveFn, SimpleFormResolverService } from 'src/app/library/simple-form';
import { ProductsService } from 'src/app/services/products.service';

@Injectable({
  providedIn: 'any'
})
export class ProductResolverService extends SimpleFormResolverService<Product> {

  constructor(
    router: Router,
    private productsService: ProductsService,
  ) {
    super(router);
  }

  retrieveFn: RetrieveFn<Product> = (route) => {
    const id: string = route.paramMap.get('id');
    if (!id) { return EMPTY; }
    return this.productsService.getProduct(id);
  };

}
