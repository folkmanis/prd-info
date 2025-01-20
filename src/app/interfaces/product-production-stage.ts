import { Expose, Type } from 'class-transformer';

export class ProductProductionStageMaterial {
  @Expose()
  materialId: string = '';

  @Expose()
  amount: number = 0;

  @Expose()
  fixedAmount: number = 0;
}

export class ProductProductionStage {
  @Expose()
  productionStageId: string = '';

  @Expose()
  @Type(() => ProductProductionStageMaterial)
  materials: ProductProductionStageMaterial[] = [];

  @Expose()
  amount: number = 0;

  @Expose()
  fixedAmount: number = 0;
}
