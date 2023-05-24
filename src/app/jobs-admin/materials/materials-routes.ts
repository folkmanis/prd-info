import { Route } from '@angular/router';
import { MaterialsListComponent } from './materials-list/materials-list.component';
import { MaterialsEditComponent } from './materials-edit/materials-edit.component';
import { resolveMaterial } from './services/material-resolver';

export default [
    {
        path: '',
        component: MaterialsListComponent,
        children: [
            {
                path: 'new',
                component: MaterialsEditComponent,
                data: {
                    material: null,
                },
            },
            {
                path: ':id',
                component: MaterialsEditComponent,
                resolve: {
                    material: resolveMaterial
                }
            }
        ]
    }
] as Route[];