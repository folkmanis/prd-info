export interface ProductResult {
    product?: Product,
    products?: Product[],
    insertedId?: string,
    error: any,
    result?: {
        ok: number,
        n: number,
    };
}

export type ProductCategories = 'plates';

export interface Product {
    _id: string,
    category: ProductCategories,
    name: string,
    description?: string,
    prices?: [
        [
            string, // customer
            number, // price
        ]
    ];
}

export type ProductNoPrices = Omit<Product, 'prices'>