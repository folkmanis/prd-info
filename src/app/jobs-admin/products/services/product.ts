import { AppHttpResponseBase } from '../../services/jobs-admin.interfaces';

export interface ProductResult extends AppHttpResponseBase {
    product?: Product;
    products?: Product[];
    prices?: ProductPrice[];
}

export type ProductCategories = 'plates';

export interface Product {
    _id: string;
    category: ProductCategories;
    name: string;
    description?: string;
    prices?: ProductPrice[];
}

export interface ProductPrice {
    name: string;
    price: number;
}

export type ProductNoPrices = Omit<Product, 'prices'>;

export interface PriceChange { name: string; price: number | undefined; }
