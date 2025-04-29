import { ResolveFn } from '@angular/router';
import { newTransportationRouteSheet, TransportationRouteSheet } from '../interfaces/transportation-route-sheet';

export const newRouteSheetResolver: ResolveFn<TransportationRouteSheet> = () => newTransportationRouteSheet();
