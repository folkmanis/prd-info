export interface Material {
    _id: string;
    name: string;
    description?: string;
    units: string;
    category: string;
    inactive: boolean;
    prices: MaterialPrice[];
}

export interface MaterialPrice {
    min: number;
    max: number;
    price: number;
    description: number;
}
