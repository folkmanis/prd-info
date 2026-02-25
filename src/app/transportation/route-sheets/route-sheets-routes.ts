import { inject } from '@angular/core';
import { Route } from '@angular/router';
import { canComponentDeactivate } from 'src/app/library/guards';
import { routeSheetResolver } from '../services/route-sheet.resolver';
import { RouteSheetService } from '../services/route-sheet.service';
import { RouteSheetEditComponent } from './route-sheet-edit/route-sheet-edit.component';
import { RouteSheetListComponent } from './route-sheet-list/route-sheet-list.component';

export default [
  {
    path: '',
    component: RouteSheetListComponent,
    children: [
      {
        path: 'new',
        component: RouteSheetEditComponent,
        resolve: {
          routeSheet: () => inject(RouteSheetService).newTransportationRouteSheet(),
        },
        canDeactivate: [canComponentDeactivate],
      },
      {
        path: ':id',
        component: RouteSheetEditComponent,
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
        resolve: {
          routeSheet: routeSheetResolver,
        },
        canDeactivate: [canComponentDeactivate],
      },
    ],
  },
  { path: '**', redirectTo: '' },
] as Route[];
