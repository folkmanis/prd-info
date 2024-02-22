import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Route } from '@angular/router';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { CacheInterceptorService } from 'src/app/library/http';

export default [
  {
    path: '',
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: CacheInterceptorService,
        multi: true,
      },
    ],
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
        loadChildren: () =>
          import('./production-stages/production-stages-routes'),
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
