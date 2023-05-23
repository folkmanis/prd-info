import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductionStage } from 'src/app/interfaces';
import { ProductionStagesService } from 'src/app/services/production-stages.service';

export const resolveProductionStages: ResolveFn<ProductionStage[]> = () =>
    inject(ProductionStagesService).getProductionStages();