import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { resolveCatching } from 'src/app/library/guards';
import { RouteSheet } from '../schemas';
import { RouteSheetService } from './route-sheet.service';

export const routeSheetResolver: ResolveFn<RouteSheet> = (route, state) => {
  return resolveCatching(state.url, () => inject(RouteSheetService).getRouteSheet(route.params.id));
};
