import { Product } from './product';

export type JobProduct = Pick<Product, 'name' | 'units'> & {
    price: number;
    count: number;
    comment?: string;
};
