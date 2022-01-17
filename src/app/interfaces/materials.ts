export interface Material {
    _id: string;
    name: string;
    description?: string;
    units: string;
    category: string;
    inactive: boolean;
    prices: MaterialPrice[];
    fixedPrice?: number;
}

export interface MaterialPrice {
    min: number;
    price: number;
    description: number;
}
