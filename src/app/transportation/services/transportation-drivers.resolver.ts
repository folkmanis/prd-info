import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { resolveCatching } from 'src/app/library/guards';
import { TransportationDriver } from '../interfaces/transportation-driver';
import { TransportationDriverService } from './transportation-driver.service';

export const transportationDriversResolver: ResolveFn<TransportationDriver[]> = (_, state) =>
  resolveCatching(state.url, () => inject(TransportationDriverService).getDrivers());
