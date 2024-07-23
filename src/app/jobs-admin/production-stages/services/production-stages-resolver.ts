import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductionStage } from 'src/app/interfaces';
import { resolveCatching } from 'src/app/library/guards';
import { ProductionStagesService } from 'src/app/services/production-stages.service';

export const resolveProductionStage: ResolveFn<ProductionStage> = (route, state) => {
  const id: string = route.paramMap.get('id');
  return resolveCatching(state.url, () => inject(ProductionStagesService).getOne(id));
};
