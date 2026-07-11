import { Route } from '@angular/router';
import { newMaterial } from 'src/app/interfaces';
import { canComponentDeactivate } from 'src/app/library/guards';
import { MaterialsEditComponent } from './materials-edit/materials-edit.component';
import { MaterialsListComponent } from './materials-list/materials-list.component';
import { resolveMaterial } from './services/material-resolver';

export default [
  {
    path: '',
    component: MaterialsListComponent,
    children: [
      {
        path: 'new',
        component: MaterialsEditComponent,
        resolve: {
          material: newMaterial,
        },
        canDeactivate: [canComponentDeactivate],
      },
      {
        path: ':id',
        component: MaterialsEditComponent,
        resolve: {
          material: resolveMaterial,
        },
        canDeactivate: [canComponentDeactivate],
      },
    ],
  },
] as Route[];
