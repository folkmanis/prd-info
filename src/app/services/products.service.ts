import { computed, inject, Injectable, linkedSignal, resource, signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { CustomerProduct, JobProductionStage, NewProduct, Product, ProductionStage, ProductProductionStage } from 'src/app/interfaces';
import { ProductsApiService, ProductsFilter } from 'src/app/services/prd-api/products-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private api = inject(ProductsApiService);

  readonly filter = linkedSignal<ProductsFilter>(
    () => {
      const filter: ProductsFilter = {};
      if (this.name()) {
        filter.name = this.name();
      }
      return filter;
    },
    { equal: isEqual },
  );

  name = signal('');

  productsResource = resource({
    request: () => this.filter(),
    loader: ({ request }) => this.api.getAll(request),
  });

  products = computed(() => this.productsResource.value() ?? []);
  activeProducts = computed(() => this.products().filter((product) => !product.inactive));

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

  async productionStages(product: string): Promise<ProductProductionStage[]> {
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
    this.productsResource.reload();
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const count = await this.api.deleteOne(id);
    if (count > 0) {
      this.productsResource.reload();
    }
    return count > 0;
  }

  async insertProduct(prod: NewProduct): Promise<Product> {
    const inserted = await this.api.insertOne(prod);
    if (inserted) {
      this.productsResource.reload();
    }
    return inserted;
  }
}
