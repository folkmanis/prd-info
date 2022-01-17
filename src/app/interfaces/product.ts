import { JobProductionStage } from './job-production-stage';

export interface CustomerProduct {
    category: string;
    description: string;
    productName: string;
    customerName: string;
    price: number;
    units: string;
}

export interface Product {
    inactive: boolean;
    category: string;
    name: string;
    units: string;
    paytraqId?: number;
    description?: string;
    prices?: ProductPrice[];
    productionStages?: JobProductionStage[];
}

export type ProductPartial = Pick<Product, 'name' | 'category' | 'inactive'>;

export interface ProductPrice {
    customerName: string;
    price: number;
}

export interface PriceChange { customerName: string; price: number | undefined; }
