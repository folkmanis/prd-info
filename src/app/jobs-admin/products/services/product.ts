import { AppHttpResponseBase } from 'src/app/library/http/http-response-base';

export interface ProductResult extends AppHttpResponseBase {
    product?: Product;
    products?: ProductPartial[];
    prices?: ProductPrice[];
    customerProducts?: CustomerProduct[];
}
export type ProductPartial = Pick<Product, '_id' | 'name' | 'category'>;

export type ProductCategories = 'plates';

export interface Product {
    _id: string;
    category: ProductCategories;
    name: string;
    description?: string;
    prices?: ProductPrice[];
}

export interface ProductPrice {
    customerName: string;
    price: number;
}

export type ProductNoPrices = Omit<Product, 'prices'>;

export interface PriceChange { customerName: string; price: number | undefined; }

export interface CustomerProduct {
    category: string;
    productName: string;
    description: string;
    customerName: string;
    price: number;
}
