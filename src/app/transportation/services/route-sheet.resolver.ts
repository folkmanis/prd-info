import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { TransportationRouteSheet } from '../interfaces/transportation-route-sheet';
import { RouteSheetService } from './route-sheet.service';

export const routeSheetResolver: ResolveFn<TransportationRouteSheet> = async (route, state) => {
  const redirectUrl = inject(Router).createUrlTree(state.url.split('/').slice(0, -2));
  try {
    return await inject(RouteSheetService).getRouteSheet(route.params.id);
  } catch {
    return new RedirectCommand(redirectUrl);
  }
};
