import { Route } from '@angular/router';
import { JobsAdminMenuComponent } from './jobs-admin-menu.component';

export default [
  {
    path: '',
    children: [
      {
        path: 'customers',
        loadChildren: () => import('./customers/customers-routes'),
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products-routes'),
      },
      {
        path: 'production-stages',
        loadChildren: () => import('./production-stages/production-stages-routes'),
      },
      {
        path: 'equipment',
        loadChildren: () => import('./equipment/equipment-routes'),
      },
      {
        path: 'materials',
        loadChildren: () => import('./materials/materials-routes'),
      },
      {
        path: '',
        pathMatch: 'full',
        component: JobsAdminMenuComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
] as Route[];
