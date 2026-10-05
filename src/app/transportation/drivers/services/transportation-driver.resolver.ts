import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { notNullOrThrow } from 'src/app/library';
import { resolveCatching } from 'src/app/library/guards';
import { Driver } from '../schemas/transportation-driver';
import { TransportationDriverService } from './transportation-driver.service';

export const transportationDriverResolver: ResolveFn<Driver> = (route, state) =>
  resolveCatching(state.url, () => inject(TransportationDriverService).getDriver(notNullOrThrow(route.params.id)));
