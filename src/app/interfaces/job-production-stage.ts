import { Expose, Type } from 'class-transformer';

export class JobProductionStageMaterial {

    @Expose()
    materialId: string;

    @Expose()
    amount: number;

    @Expose()
    fixedAmount: number;
}

export class JobProductionStage {

    @Expose()
    productionStageId: string;

    @Expose()
    @Type(() => JobProductionStageMaterial)
    materials: JobProductionStageMaterial[] = [];

    @Expose()
    amount: number;

    @Expose()
    fixedAmount: number;

}
