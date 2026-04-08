import { ResolveFn } from '@angular/router';
import { resolveCatching } from 'src/app/library/guards';
import { inject } from '@angular/core';
import { TransportationVehicleService } from './transportation-vehicle.service';
import { TransportationVehicle } from '../interfaces/transportation-vehicle';

export const transportationVehicleResolver: ResolveFn<TransportationVehicle> = (route, state) =>
  resolveCatching(state.url, () => inject(TransportationVehicleService).getVehicle(route.params.id));
