import { inject, Injectable } from '@angular/core';
import { CustomerProduct, NewProduct, Product, ProductProductionStage } from 'src/app/interfaces';
import { ProductsApiService, ProductsFilter } from 'src/app/services/prd-api/products-api.service';
import { FilterInput, toFilterSignal } from '../library';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private api = inject(ProductsApiService);

  getProductsResource(filterSignal?: FilterInput<ProductsFilter>) {
    return this.api.productsResource(toFilterSignal(filterSignal));
  }

  getProduct(id: string): Promise<Product> {
    return this.api.getOne(id);
  }

  getProductByName(name: string): Promise<Product> {
    return this.api.getOneByName(name);
  }

  async productsCustomer(customer: string): Promise<CustomerProduct[]> {
    try {
      return await this.api.productsCustomer(customer);
    } catch (error) {
      return [];
    }
  }

  productionStages(product: string): Promise<ProductProductionStage[]> {
    return this.api.productionStages(product);
  }

  async validate<K extends keyof Product>(key: K, value: Product[K]): Promise<boolean> {
    try {
      const values = await this.api.validatorData(key);
      return !values.includes(value);
    } catch (error) {
      return false;
    }
  }

  updateProduct({ _id, ...rest }: Partial<Product>): Promise<Product> {
    return this.api.updateOne(_id, rest);
  }

  insertProduct(prod: NewProduct): Promise<Product> {
    return this.api.insertOne(prod);
  }
}
