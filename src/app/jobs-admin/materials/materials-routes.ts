import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { MaterialsEditComponent } from './materials-edit/materials-edit.component';
import { MaterialsListComponent } from './materials-list/materials-list.component';
import { resolveMaterial } from './services/material-resolver';
import { MaterialsService } from './services/materials.service';

export default [
  {
    path: '',
    component: MaterialsListComponent,
    children: [
      {
        path: 'new',
        component: MaterialsEditComponent,
        resolve: {
          material: () => inject(MaterialsService).newMaterial(),
        },
      },
      {
        path: ':id',
        component: MaterialsEditComponent,
        resolve: {
          material: resolveMaterial,
        },
        runGuardsAndResolvers: 'always',
      },
    ],
  },
] as Route[];
