import { Route } from '@angular/router';
import { MainMenuComponent } from './main-menu/main-menu.component';

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
        component: MainMenuComponent,
      },
      {
        path: '**',
        redirectTo: '',
      },
    ],
  },
] as Route[];
