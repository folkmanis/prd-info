import { Transform, Type, Expose } from 'class-transformer';


export class DropFolder {

    @Expose()
    path: string[];

    @Expose()
    customers: string[];

    isDefault(): boolean {
        return this.customers.includes('**');
    }

    includesCustomer(customerName: string): boolean {
        return this.customers.includes(customerName);
    }

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

    @Expose()
    @Type(() => DropFolder)
    dropFolders: DropFolder[] = [];

}

export type CreateProductionStage = Omit<ProductionStage, '_id'>;

export type UpdateProductionStage = Pick<ProductionStage, '_id'> & Partial<ProductionStage>;
