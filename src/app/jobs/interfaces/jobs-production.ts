import { Expose, Type, Transform } from 'class-transformer';
import { Product } from 'src/app/interfaces';

type ProductionProduct = Pick<Product, 'name' | 'units' | 'category' | 'description' | 'inactive'>;

export class JobsProduction implements ProductionProduct {

    @Expose()
    _id: string;

    @Expose()
    name: string;

    @Expose()
    units: string;

    @Expose()
    category: string;

    @Expose()
    description?: string;

    @Type(() => Boolean)
    inactive: boolean;

    @Expose()
    @Type(() => Number)
    sum: number;

    @Expose()
    @Type(() => Number)
    count: number;

    @Expose()
    @Type(() => Number)
    total: number;

}
