import { Route } from '@angular/router';
import { TransportationMainMenuComponent } from './transportation-main-menu.component';

export default [
  {
    path: '',
    pathMatch: 'full',
    component: TransportationMainMenuComponent,
  },
  {
    path: 'drivers',
    loadChildren: () => import('./transportation-driver/transportation-driver-routes'),
  },
  {
    path: 'vehicles',
    loadChildren: () => import('./transportation-vehicles/transportation-vehicles-routes'),
  },
  {
    path: 'route-sheets',
    loadChildren: () => import('./route-sheets/route-sheets-routes'),
  },
  {
    path: 'monthly-consumption',
    loadComponent: () =>
      import('./monthly-consumption/monthly-consumption.component').then((c) => c.MonthlyConsumptionComponent),
  },
  { path: '**', redirectTo: '' },
] as Route[];
