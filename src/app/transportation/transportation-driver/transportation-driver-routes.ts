import { Route } from '@angular/router';
import { canComponentDeactivate } from 'src/app/library/guards';
import { newTransportationDriver } from '../interfaces/transportation-driver';
import { transportationDriverResolver } from '../services/transportation-driver.resolver';
import { TransportationDriverEditComponent } from './transportation-driver-edit/transportation-driver-edit.component';
import { TransportationDriverListComponent } from './transportation-driver-list/transportation-driver-list.component';

export default [
  {
    path: '',
    component: TransportationDriverListComponent,
    children: [
      {
        path: 'new',
        component: TransportationDriverEditComponent,
        resolve: {
          driver: () => newTransportationDriver(),
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
