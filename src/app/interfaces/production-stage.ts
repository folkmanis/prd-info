import { Transform, Type, Expose } from 'class-transformer';


export class DropFolder {

    @Expose()
    description?: string;

    @Expose()
    path: string[];

    @Expose()
    customer: string;

}

export class ProductionStage {

    @Expose()
    _id: string;

    @Expose()
    name: string;

    @Expose()
    description?: string;

    @Expose()
    equipmentIds: string[] = [];

    @Expose()
    @Type(() => DropFolder)
    dropFolders: DropFolder[] = [];

}

export type CreateProductionStage = Omit<ProductionStage, '_id'>;

export type UpdateProductionStage = Pick<ProductionStage, '_id'> & Partial<ProductionStage>;
