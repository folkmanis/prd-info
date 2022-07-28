import { Transform, Type, Expose } from 'class-transformer';


export class DropFolder {

    @Expose()
    path: string[];

    @Expose()
    customers: string[];

}

export class ProductionStage {

    @Expose()
    _id: string;

    @Expose()
    name: string;

    @Expose()
    description?: string = null;

    @Expose()
    equipmentIds: string[] = [];

}

export type CreateProductionStage = Omit<ProductionStage, '_id'>;

export type UpdateProductionStage = Pick<ProductionStage, '_id'> & Partial<ProductionStage>;
