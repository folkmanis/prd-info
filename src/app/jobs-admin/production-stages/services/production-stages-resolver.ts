import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductionStage } from 'src/app/interfaces';
import { ProductionStagesService } from 'src/app/services/production-stages.service';

export const resolveProductionStage: ResolveFn<ProductionStage> = (route) => {
    const id: string = route.paramMap.get('id');
    return inject(ProductionStagesService).getOne(id);
};