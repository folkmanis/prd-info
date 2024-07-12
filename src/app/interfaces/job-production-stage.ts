import { Expose, Type } from 'class-transformer';

export class JobProductionStageMaterial {
  @Expose()
  materialId: string = '';

  @Expose()
  amount: number = 0;

  @Expose()
  fixedAmount: number = 0;
}

export class JobProductionStage {
  @Expose()
  productionStageId: string = '';

  @Expose()
  @Type(() => JobProductionStageMaterial)
  materials: JobProductionStageMaterial[] = [];

  @Expose()
  amount: number = 0;

  @Expose()
  fixedAmount: number = 0;

  productionStatus?: number = 10;
}
