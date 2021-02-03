import { AppHttpResponseBase } from 'src/app/library';

export interface ProductResponse extends AppHttpResponseBase<Product> {
    customerProducts?: CustomerProduct[];
    prices?: any[];
}

export interface CustomerProduct {
    category: string;
    description: string;
    productName: string;
    customerName: string;
    price: number;
    units: string;
}

export interface Product {
    _id: string;
    inactive: boolean;
    category: string;
    name: string;
    units: string;
    description?: string;
    prices?: ProductPrice[];
}

export type ProductPartial = Pick<Product, '_id' | 'name' | 'category' | 'inactive'>;

export interface ProductPrice {
    customerName: string;
    price: number;
}

export type ProductNew = Omit<Product, '_id'>;

export interface PriceChange { customerName: string; price: number | undefined; }
