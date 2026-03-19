import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map, Observable } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { HttpOptions, httpResponseRequest, ValidatorService } from 'src/app/library';
import { HistoricalData } from '../interfaces/historical-data';
import { TransportationCustomer } from '../interfaces/transportation-customer';
import {
  RouteStop,
  TransportationRouteSheet,
  TransportationRouteSheetCreate,
  TransportationRouteSheetUpdate,
} from '../interfaces/transportation-route-sheet';

@Injectable({
  providedIn: 'root',
})
export class RouteSheetApiService {
  readonly #path = getAppParams('apiPath') + 'transportation';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  routeSheetResource(params: Signal<Record<string, any>>) {
    return httpResource(() => httpResponseRequest(this.#path, new HttpOptions(params()).cacheable()), {
      parse: this.#validator.arrayValidatorFn(TransportationRouteSheet),
      defaultValue: [],
      equal: isEqual,
    });
  }

  getRouteSheets(params: Record<string, any>): Promise<TransportationRouteSheet[]> {
    const response$ = this.#http.get<Record<string, any>[]>(this.#path, new HttpOptions(params));
    return this.#validator.validateArrayAsync(TransportationRouteSheet, response$);
  }

  getOne(id: string): Promise<TransportationRouteSheet> {
    const response$ = this.#http.get<Record<string, any>>(`${this.#path}/${id}`, new HttpOptions());
    return this.#validator.validateAsync(TransportationRouteSheet, response$);
  }

  createOne(data: TransportationRouteSheetCreate): Promise<TransportationRouteSheet> {
    const response$ = this.#http.put<Record<string, any>>(this.#path, data, new HttpOptions());
    return this.#validator.validateAsync(TransportationRouteSheet, response$);
  }

  updateOne(id: string, update: TransportationRouteSheetUpdate): Promise<TransportationRouteSheet> {
    const response$ = this.#http.patch<Record<string, any>>(`${this.#path}/${id}`, update, new HttpOptions());
    return this.#validator.validateAsync(TransportationRouteSheet, response$);
  }

  async deleteOne(id: string): Promise<number> {
    const response$ = this.#http.delete<{ deletedCount: number }>(`${this.#path}/${id}`, new HttpOptions());
    const { deletedCount } = await firstValueFrom(response$);
    return deletedCount;
  }

  getCustomers() {
    return this.#http
      .get<Record<string, any>[]>(this.#path + '/customers', new HttpOptions().cacheable())
      .pipe(map(this.#validator.arrayValidatorFn(TransportationCustomer)));
  }

  async distanceRequest(request: {
    tripStops: Pick<RouteStop, 'address' | 'googleLocationId'>[];
  }): Promise<{ distance: number }> {
    const response$ = this.#http.post<{ distance: number }>(
      this.#path + '/distance-request',
      request,
      new HttpOptions(),
    );
    return await firstValueFrom(response$);
  }

  getDescriptions(count?: number): Observable<string[]> {
    return this.#http.get<string[]>(this.#path + '/descriptions', new HttpOptions({ count }).cacheable());
  }

  getHistoricalDataResource(licencePlate: Signal<string | null | undefined>) {
    return httpResource(
      () => (licencePlate() ? httpResponseRequest(this.#path + '/historical-data/' + licencePlate()) : undefined),
      {
        parse: this.#validator.validatorFn(HistoricalData),
      },
    );
  }

  getHistoricalData(licencePlate: string): Observable<HistoricalData> {
    return this.#http
      .get<HistoricalData>(this.#path + '/historical-data/' + licencePlate, new HttpOptions())
      .pipe(map(this.#validator.validatorFn(HistoricalData)));
  }
}
