import { Route } from '@angular/router';
import { canComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ProductionStagesEditComponent } from './production-stages-edit/production-stages-edit.component';
import { ProductionStagesListComponent } from './production-stages-list/production-stages-list.component';
import { resolveProductionStage } from './services/production-stages-resolver';
import { inject } from '@angular/core';
import { ProductionStagesService } from 'src/app/services/production-stages.service';

export default [
  {
    path: '',
    component: ProductionStagesListComponent,
    children: [
      {
        path: 'new',
        component: ProductionStagesEditComponent,
        canDeactivate: [canComponentDeactivate],
        resolve: {
          productionStage: () => inject(ProductionStagesService).newProductionStage(),
        },
      },
      {
        path: ':id',
        component: ProductionStagesEditComponent,
        canDeactivate: [canComponentDeactivate],
        resolve: {
          productionStage: resolveProductionStage,
        },
      },
    ],
  },
] as Route[];
