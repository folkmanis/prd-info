export interface ProductionStage {
    _id: string;
    name: string;
    description?: string;
    equipmentIds: string[];
}

export type CreateProductionStage = Partial<Omit<ProductionStage, '_id'>>;

export type UpdateProductionStage = Pick<ProductionStage, '_id'> & Partial<ProductionStage>;
