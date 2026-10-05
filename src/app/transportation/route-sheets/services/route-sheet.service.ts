import { inject, Service, Signal } from '@angular/core';
import { round } from 'lodash-es';
import { catchError, Observable, of } from 'rxjs';
import { FilterInput, toFilterSignal } from 'src/app/library';
import {
  HistoricalData,
  RouteSheet,
  RouteSheetCreate,
  RouteSheetList,
  RouteSheetQuery,
  RouteSheetUpdate,
  RouteTrip,
  RouteTripStop,
} from '../schemas';
import { RouteSheetApiService } from './route-sheet-api.service';
import { SchemaPath } from '@angular/forms/signals';
import { GeneralSetupModel } from '../route-sheet-edit/general-setup/general-setup.model.service';

export function newRouteTrip(): RouteTrip {
  return {
    date: new Date(),
    tripLengthKm: 0,
    fuelConsumed: 0,
    odoStartKm: 0,
    odoStopKm: 0,
    description: '',
    stops: [],
  };
}

@Service()
export class RouteSheetService {
  #api = inject(RouteSheetApiService);

  getRouteSheetsResource(filter?: FilterInput<RouteSheetQuery>) {
    return this.#api.routeSheetResource(toFilterSignal(filter));
  }

  getRouteSheets(filter: RouteSheetQuery = {}): Promise<RouteSheetList[]> {
    return this.#api.getRouteSheets(filter);
  }

  getHistoricalDataResource(licencePlate: Signal<string | undefined>) {
    return this.#api.getHistoricalDataResource(licencePlate);
  }

  getRouteSheet(id: string): Observable<RouteSheet> {
    return this.#api.getOne(id);
  }

  getCustomers() {
    return this.#api.getCustomers();
  }

  createRouteSheet(routeSheet: RouteSheetCreate): Promise<RouteSheet> {
    return this.#api.createOne(routeSheet);
  }

  async deleteRouteSheet(id: string): Promise<number> {
    const deletedCount = await this.#api.deleteOne(id);
    if (deletedCount > 0) {
      return deletedCount;
    } else {
      throw new Error(`${id} not found`);
    }
  }

  updateRouteSheet(_id: string, routeSheet: RouteSheetUpdate): Promise<RouteSheet> {
    return this.#api.updateOne(_id, routeSheet);
  }

  async getTripLength(stops: Pick<RouteTripStop, 'address' | 'googleLocationId'>[]): Promise<number> {
    const { distance } = await this.#api.distanceRequest({
      tripStops: stops,
    });
    return round(this.#randomizeTripLength(distance / 1000));
  }

  descriptions(): Observable<string[]> {
    return this.#api.getDescriptions(10);
  }

  getHistoricalData(licencePlate: string): Observable<HistoricalData | null> {
    return this.#api.getHistoricalData(licencePlate).pipe(catchError(() => of(null)));
  }

  validateDuplicateRouteSheet(schema: SchemaPath<GeneralSetupModel>): void {
    this.#api.validateDuplicateRouteSheet(schema);
  }

  #randomizeTripLength(value: number): number {
    return value + (value / 10) * Math.random();
  }
}
