import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { canComponentDeactivate } from 'src/app/library/guards';
import { routeSheetResolver } from '../services/route-sheet.resolver';
import { RouteSheetService } from '../services/route-sheet.service';
import { RouteSheetEditComponent } from './route-sheet-edit/route-sheet-edit.component';
import { RouteSheetListComponent } from './route-sheet-list/route-sheet-list.component';
import { GeneralSetupComponent } from './route-sheet-edit/general-setup/general-setup.component';
import { transportationDriversResolver } from '../services/transportation-drivers.resolver';
import { transportationVehiclesResolver } from '../services/transportation-vehicles.resolver';
import { FuelPurchasesComponent } from './route-sheet-edit/fuel-purchases/fuel-purchases.component';
import { RouteTripsComponent } from './route-sheet-edit/route-trips/route-trips.component';

export default [
  {
    path: '',
    component: RouteSheetListComponent,
    children: [
      {
        path: 'new',
        component: GeneralSetupComponent,
        resolve: {
          routeSheet: () => inject(RouteSheetService).newTransportationRouteSheet(),
          drivers: transportationDriversResolver,
          vehicles: transportationVehiclesResolver,
        },
        canDeactivate: [canComponentDeactivate],
      },
      {
        path: ':id',
        component: RouteSheetEditComponent,
        children: [
          {
            path: 'general-setup',
            component: GeneralSetupComponent,
            resolve: {
              routeSheet: routeSheetResolver,
              drivers: transportationDriversResolver,
              vehicles: transportationVehiclesResolver,
            },
            canDeactivate: [canComponentDeactivate],
          },
          {
            path: 'fuel-purchases',
            component: FuelPurchasesComponent,
            resolve: {
              routeSheet: routeSheetResolver,
            },
          },
          {
            path: 'trips',
            component: RouteTripsComponent,
            resolve: {
              routeSheet: routeSheetResolver,
            },
          },
          {
            path: '**',
            redirectTo: 'general-setup',
          },
        ],
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
    ],
  },
  { path: '**', redirectTo: '' },
] as Route[];
