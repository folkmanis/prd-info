import { Route } from '@angular/router';
import { canComponentDeactivate } from 'src/app/library/guards';
import { transportationDriverResolver } from '../services/transportation-driver.resolver';
import { TransportationDriverEditComponent } from './transportation-driver-edit/transportation-driver-edit.component';
import { TransportationDriverListComponent } from './transportation-driver-list/transportation-driver-list.component';
import { inject } from '@angular/core';
import { TransportationDriverService } from '../services/transportation-driver.service';

export default [
  {
    path: '',
    component: TransportationDriverListComponent,
    children: [
      {
        path: 'new',
        component: TransportationDriverEditComponent,
        resolve: {
          driver: () => inject(TransportationDriverService).newTransportationDriver(),
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
