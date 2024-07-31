import { ResolveFn } from '@angular/router';
import { TransportationDriver } from '../interfaces/transportation-driver';
import { resolveCatching } from 'src/app/library/guards';
import { inject } from '@angular/core';
import { TransportationDriverService } from './transportation-driver.service';

export const transportationDriverResolver: ResolveFn<TransportationDriver> = (route, state) => {
  return resolveCatching(state.url, async () => {
    const id = route.params.id;
    return await inject(TransportationDriverService).getDriver(id);
  });
};
