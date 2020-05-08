import { AppHttpResponseBase } from 'src/app/library';

export type ProductResult = AppHttpResponseBase<Product>;

export interface Product {
    _id: string;
    category: string;
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
