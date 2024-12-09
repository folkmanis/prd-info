import { Route } from '@angular/router';
import { ProductionStage } from 'src/app/interfaces';
import { canComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { ProductionStagesEditComponent } from './production-stages-edit/production-stages-edit.component';
import { ProductionStagesListComponent } from './production-stages-list/production-stages-list.component';
import { resolveProductionStage } from './services/production-stages-resolver';

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
          productionStage: () => new ProductionStage(),
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
