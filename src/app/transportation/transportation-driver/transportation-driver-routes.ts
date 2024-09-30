import { Route } from '@angular/router';
import { TransportationDriverListComponent } from './transportation-driver-list/transportation-driver-list.component';
import { TransportationDriverEditComponent } from './transportation-driver-edit/transportation-driver-edit.component';
import { TransportationDriver } from '../interfaces/transportation-driver';
import { transportationDriverResolver } from '../services/transportation-driver.resolver';
import { canComponentDeactivate } from 'src/app/library/guards';

export default [
  {
    path: '',
    component: TransportationDriverListComponent,
    children: [
      {
        path: 'new',
        component: TransportationDriverEditComponent,
        resolve: {
          driver: () => new TransportationDriver(),
        },
        canDeactivate: [canComponentDeactivate],
      },
      {
        path: ':id',
        component: TransportationDriverEditComponent,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        resolve: {
          driver: transportationDriverResolver,
        },
        canDeactivate: [canComponentDeactivate],
      },
    ],
  },
] as Route[];
