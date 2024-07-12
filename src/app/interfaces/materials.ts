import { Expose, Type } from 'class-transformer';

export class MaterialPrice {
  @Expose()
  min: number;

  @Expose()
  price: number = 0;

  @Expose()
  description?: string;
}

export class Material {
  @Expose()
  _id: string = '';

  @Expose()
  name: string = '';

  @Expose()
  units: string = '';

  @Expose()
  category: string = '';

  @Expose()
  inactive: boolean = false;

  @Expose()
  @Type(() => MaterialPrice)
  prices: MaterialPrice[] = [];

  @Expose()
  fixedPrice: number = 0;

  @Expose()
  description: string | null = null;
}
