import { Expose, Transform, Type } from 'class-transformer';
import { ProductProductionStage } from './product-production-stage';

export class CustomerProduct {
  @Expose()
  category: string;

  @Expose()
  description: string;

  @Expose()
  productName: string;

  @Expose()
  customerName: string;

  @Expose()
  price: number;

  @Expose()
  units: string;
}

export class Product {
  @Expose()
  _id: string;

  @Expose()
  @Transform(({ value }) => !!value)
  inactive: boolean = false;

  @Expose()
  category: string;

  @Expose()
  name: string;

  @Expose()
  units: string;

  @Expose()
  paytraqId?: number;

  @Expose()
  description?: string;

  @Expose()
  @Type(() => ProductPrice)
  prices: ProductPrice[] = [];

  @Expose()
  @Type(() => ProductProductionStage)
  productionStages: ProductProductionStage[] = [];
}

export type ProductPartial = Pick<Product, '_id' | 'name' | 'category' | 'inactive'>;

export class ProductPrice {
  @Expose()
  customerName: string;

  @Expose()
  price: number;

  @Type(() => Date)
  @Transform(({ value }) => new Date(value))
  lastUsed: Date | null = null;
}

export interface PriceChange {
  customerName: string;
  price: number | undefined;
}

export type NewProduct = Omit<Product, '_id'>;
