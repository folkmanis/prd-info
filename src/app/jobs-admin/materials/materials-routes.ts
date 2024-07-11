import { Route } from '@angular/router';
import { MaterialsListComponent } from './materials-list/materials-list.component';
import { MaterialsEditComponent } from './materials-edit/materials-edit.component';
import { resolveMaterial } from './services/material-resolver';
import { Material } from 'src/app/interfaces';

export default [
  {
    path: '',
    component: MaterialsListComponent,
    children: [
      {
        path: 'new',
        component: MaterialsEditComponent,
        resolve: {
          material: () => new Material(),
        },
      },
      {
        path: ':id',
        component: MaterialsEditComponent,
        resolve: {
          material: resolveMaterial
        },
        runGuardsAndResolvers: 'always',
      }
    ]
  }
] as Route[];
