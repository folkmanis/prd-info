import { Route } from '@angular/router';
import { canComponentDeactivate } from 'src/app/library/guards';
import { RouteSheetEditComponent } from './route-sheet-edit/route-sheet-edit.component';
import { RouteSheetListComponent } from './route-sheet-list/route-sheet-list.component';
import { routeSheetResolver } from './services/route-sheet.resolver';

export default [
  {
    path: '',
    component: RouteSheetListComponent,
    children: [
      {
        path: 'new',
        component: RouteSheetEditComponent,
        data: {
          routeSheet: null,
        },
        canDeactivate: [canComponentDeactivate],
      },
      {
        path: ':id',
        component: RouteSheetEditComponent,
        resolve: {
          routeSheet: routeSheetResolver,
        },
        canDeactivate: [canComponentDeactivate],
        runGuardsAndResolvers: 'paramsOrQueryParamsChange',
      },
    ],
  },
  { path: '**', redirectTo: '' },
] as Route[];
