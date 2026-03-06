import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { resolveCatching } from 'src/app/library/guards';
import { TransportationVehicle } from '../interfaces/transportation-vehicle';
import { TransportationVehicleService } from './transportation-vehicle.service';

export const transportationVehiclesResolver: ResolveFn<TransportationVehicle[]> = (_, state) =>
  resolveCatching(state.url, () => inject(TransportationVehicleService).getVehicles());
