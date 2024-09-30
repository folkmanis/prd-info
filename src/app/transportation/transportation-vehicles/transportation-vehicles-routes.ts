import { Route } from '@angular/router';
import { TransportationVehiclesListComponent } from './transportation-vehicles-list/transportation-vehicles-list.component';
import { TransportationVehicleEditComponent } from './transportation-vehicle-edit/transportation-vehicle-edit.component';
import { TransportationVehicle } from '../interfaces/transportation-vehicle';
import { transportationVehicleResolver } from '../services/transportation-vehicle.resolver';
import { canComponentDeactivate } from 'src/app/library/guards';

export default [
  {
    path: '',
    component: TransportationVehiclesListComponent,
    children: [
      {
        path: 'new',
        component: TransportationVehicleEditComponent,
        resolve: {
          vehicle: () => new TransportationVehicle(),
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
