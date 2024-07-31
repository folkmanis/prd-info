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
  { path: '**', redirectTo: '' },
] as Route[];
