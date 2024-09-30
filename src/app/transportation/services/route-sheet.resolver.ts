import { ResolveFn } from '@angular/router';
import { resolveCatching } from 'src/app/library/guards';
import { TransportationRouteSheet } from '../interfaces/transportation-route-sheet';
import { inject } from '@angular/core';
import { RouteSheetService } from './route-sheet.service';

export const routeSheetResolver: ResolveFn<TransportationRouteSheet> = (route, state) => {
  return resolveCatching(state.url, () => inject(RouteSheetService).getRouteSheet(route.params.id));
};
