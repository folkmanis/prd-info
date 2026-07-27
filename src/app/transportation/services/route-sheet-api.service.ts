import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { pluckDeletedCount } from 'src/app/interfaces';
import {
  cacheable,
  httpFilter,
  httpFilterSignal,
  httpParams,
  httpResponseRequest,
  stringToArray,
  stringToInt,
  validateAsync,
  validatorFn,
} from 'src/app/library';
import { z } from 'zod';
import { HistoricalData } from '../interfaces/historical-data';
import { TransportationCustomer } from '../interfaces/transportation-customer';
import {
  RouteStop,
  TransportationRouteSheet,
  TransportationRouteSheetCreate,
  TransportationRouteSheetUpdate,
} from '../interfaces/transportation-route-sheet';

const RouteSheetFilterSchema = z
  .object({
    name: z.string(),
    fuelTypes: stringToArray(z.number()),
    year: stringToInt,
    month: stringToInt,
    vehicleId: z.string(),
  })
  .partial();
export type RouteSheetFilter = z.infer<typeof RouteSheetFilterSchema>;

@Service()
export class RouteSheetApiService {
  readonly #path = getAppParams('apiPath') + 'transportation';
  #http = inject(HttpClient);

  routeSheetResource(filter: Signal<RouteSheetFilter | undefined>) {
    const query = httpFilterSignal(RouteSheetFilterSchema, filter);
    return httpResource(() => httpResponseRequest(this.#path, query().cacheable()), {
      parse: validatorFn(TransportationRouteSheet.array()),
      defaultValue: [],
      equal: isEqual,
    });
  }

  getRouteSheets(filter: RouteSheetFilter | undefined): Promise<TransportationRouteSheet[]> {
    const query = httpFilter(RouteSheetFilterSchema, filter);
    const response$ = this.#http.get(this.#path, query);
    return validateAsync(TransportationRouteSheet.array(), response$);
  }

  getOne(id: string): Promise<TransportationRouteSheet> {
    const response$ = this.#http.get(`${this.#path}/${id}`);
    return validateAsync(TransportationRouteSheet, response$);
  }

  createOne(data: TransportationRouteSheetCreate): Promise<TransportationRouteSheet> {
    const response$ = this.#http.put(this.#path, data);
    return validateAsync(TransportationRouteSheet, response$);
  }

  updateOne(id: string, update: TransportationRouteSheetUpdate): Promise<TransportationRouteSheet> {
    const response$ = this.#http.patch(`${this.#path}/${id}`, update);
    return validateAsync(TransportationRouteSheet, response$);
  }

  async deleteOne(id: string): Promise<number> {
    const response$ = this.#http.delete(`${this.#path}/${id}`).pipe(pluckDeletedCount());
    return firstValueFrom(response$);
  }

  getCustomers(): Observable<TransportationCustomer[]> {
    return this.#http
      .get(this.#path + '/customers', cacheable())
      .pipe(map(validatorFn(TransportationCustomer.array())));
  }

  async distanceRequest(request: {
    tripStops: Pick<RouteStop, 'address' | 'googleLocationId'>[];
  }): Promise<{ distance: number }> {
    const response$ = this.#http
      .post(this.#path + '/distance-request', request)
      .pipe(map(validatorFn(z.object({ distance: z.number() }))));
    return firstValueFrom(response$);
  }

  getDescriptions(count?: number): Observable<string[]> {
    return this.#http.get<string[]>(this.#path + '/descriptions', httpParams({ count }).cacheable());
  }

  getHistoricalDataResource(licencePlate: Signal<string | null | undefined>) {
    return httpResource(
      () => (licencePlate() ? httpResponseRequest(this.#path + '/historical-data/' + licencePlate()) : undefined),
      {
        parse: validatorFn(HistoricalData),
      },
    );
  }

  getHistoricalData(licencePlate: string): Observable<HistoricalData> {
    return this.#http
      .get<HistoricalData>(this.#path + '/historical-data/' + licencePlate)
      .pipe(map(validatorFn(HistoricalData)));
  }
}
