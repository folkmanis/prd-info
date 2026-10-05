import { ResolveFn } from '@angular/router';
import { resolveCatching } from 'src/app/library/guards';
import { inject } from '@angular/core';
import { TransportationVehicleService } from './transportation-vehicle.service';
import { Vehicle } from '../schemas/transportation-vehicle';

export const transportationVehicleResolver: ResolveFn<Vehicle> = (route, state) =>
  resolveCatching(state.url, () => inject(TransportationVehicleService).getVehicle(route.params.id));
