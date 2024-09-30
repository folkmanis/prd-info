import { ResolveFn } from '@angular/router';
import { TransportationRouteSheet } from '../interfaces/transportation-route-sheet';

export const newRouteSheetResolver: ResolveFn<TransportationRouteSheet> = () => {
  const routeSheet = new TransportationRouteSheet();
  routeSheet.month = new Date().getMonth() + 1;
  routeSheet.year = new Date().getFullYear();
  return routeSheet;
};
