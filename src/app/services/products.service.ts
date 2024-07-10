import { computed, inject, Injectable, signal } from '@angular/core';
import {
  CustomerProduct,
  JobProductionStage,
  NewProduct,
  Product,
  ProductPartial,
} from 'src/app/interfaces';
import { ProductsApiService } from 'src/app/services/prd-api/products-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private api = inject(ProductsApiService);

  readonly #products = signal<ProductPartial[]>([]);

  products = this.#products.asReadonly();

  activeProducts = computed(() => this.#products().filter((product) => !product.inactive));

  constructor() {
    this.reload();
  }

  async reload() {
    this.#products.set(await this.api.getAll());
  }

  async getProduct(id: string): Promise<Product> {
    return this.api.getOne(id);
  }

  async getProductByName(name: string): Promise<Product> {
    return this.api.getOneByName(name);
  }

  async productsCustomer(customer: string): Promise<CustomerProduct[]> {
    try {
      return await this.api.productsCustomer(customer);
    } catch (error) {
      return [];
    }
  }

  async productionStages(product: string): Promise<JobProductionStage[]> {
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

  async updateProduct({ _id, ...rest }: Partial<Product>): Promise<Product> {
    const updated = await this.api.updateOne(_id, rest);
    const products = this.#products();
    const idx = products.findIndex((p) => p._id, updated._id);
    if (idx > -1) {
      this.#products.set([...products.slice(0, idx), updated, ...products.slice(idx + 1)]);
    } else {
      this.#products.set([updated, ...products]);
    }
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const count = await this.api.deleteOne(id);
    if (count > 0) {
      this.reload();
    }
    return count > 0;
  }

  async insertProduct(prod: NewProduct): Promise<Product> {
    const inserted = await this.api.insertOne(prod);
    if (inserted) {
      this.reload();
    }
    return inserted;
  }

}
