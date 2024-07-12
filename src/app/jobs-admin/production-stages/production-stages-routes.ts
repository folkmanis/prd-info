import { Route } from '@angular/router';
import { ProductionStagesListComponent } from './production-stages-list/production-stages-list.component';
import { ProductionStagesEditComponent } from './production-stages-edit/production-stages-edit.component';
import { canComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { resolveProductionStage } from './services/production-stages-resolver';
import { resolveEquipmentList } from './services/equipment-resolver';
import { resolveDropFolders } from './services/drop-folders-resolver';
import { resolveCustomers } from './services/customers-resolver';

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
          equipment: resolveEquipmentList,
          dropFolders: resolveDropFolders,
          customers: resolveCustomers,
        },
      },
      {
        path: ':id',
        component: ProductionStagesEditComponent,
        canDeactivate: [canComponentDeactivate],
        resolve: {
          productionStage: resolveProductionStage,
          equipment: resolveEquipmentList,
          dropFolders: resolveDropFolders,
          customers: resolveCustomers,
        },
      },
    ],
  },
] as Route[];
