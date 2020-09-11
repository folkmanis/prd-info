import { Product } from './product';

export type JobProduct = Pick<Product, 'name'> & {
    price: number;
    count: number;
    comment?: string;
};
