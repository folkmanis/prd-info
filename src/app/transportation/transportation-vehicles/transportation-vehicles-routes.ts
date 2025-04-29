import { Route } from '@angular/router';
import { canComponentDeactivate } from 'src/app/library/guards';
import { newTransportationVehicle } from '../interfaces/transportation-vehicle';
import { transportationVehicleResolver } from '../services/transportation-vehicle.resolver';
import { TransportationVehicleEditComponent } from './transportation-vehicle-edit/transportation-vehicle-edit.component';
import { TransportationVehiclesListComponent } from './transportation-vehicles-list/transportation-vehicles-list.component';

export default [
  {
    path: '',
    component: TransportationVehiclesListComponent,
    children: [
      {
        path: 'new',
        component: TransportationVehicleEditComponent,
        resolve: {
          vehicle: () => newTransportationVehicle(),
        },
        canDeactivate: [canComponentDeactivate],
      },
      {
        path: ':id',
        component: TransportationVehicleEditComponent,
        resolve: {
          vehicle: transportationVehicleResolver,
        },
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        canDeactivate: [canComponentDeactivate],
      },
    ],
  },
] as Route[];
