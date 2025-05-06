import { computed, inject, Injectable } from '@angular/core';
import { round } from 'lodash-es';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { HistoricalData } from '../interfaces/historical-data';
import { RouteStop, TransportationRouteSheet, TransportationRouteSheetCreate, TransportationRouteSheetUpdate } from '../interfaces/transportation-route-sheet';
import { RouteSheetApiService } from './route-sheet-api.service';
import { TransportationDriverService } from './transportation-driver.service';
import { TransportationVehicleService } from './transportation-vehicle.service';

interface RouteSheetFilter {
  name?: string;
  fuelTypes?: string[];
  year?: number;
  month?: number;
}

@Injectable()
export class RouteSheetService {
  #api = inject(RouteSheetApiService);
  #driverService = inject(TransportationDriverService);
  #vehicleService = inject(TransportationVehicleService);

  getRouteSheetsResource(filter: FilterInput<RouteSheetFilter>) {
    const filterSignal = toFilterSignal(filter);
    const params = computed(() => {
      const { name, year, month, fuelTypes } = filterSignal();
      return {
        name,
        year: year?.toString(),
        month: month?.toString(),
        fuelTypes: fuelTypes ? fuelTypes.join(',') : undefined,
      };
    });
    return this.#api.routeSheetResource(params);
  }

  async getRouteSheet(id: string) {
    return this.#api.getOne(id);
  }

  async getCustomers() {
    return await this.#api.getCustomers();
  }

  createRouteSheet(routeSheet: TransportationRouteSheetCreate): Promise<TransportationRouteSheet> {
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

  updateRouteSheet(_id: string, routeSheet: TransportationRouteSheetUpdate): Promise<TransportationRouteSheet> {
    return this.#api.updateOne(_id, routeSheet);
  }

  async getTripLength(stops: RouteStop[]): Promise<number> {
    const { distance } = await this.#api.distanceRequest({ tripStops: stops.map(({ address, googleLocationId }) => ({ address, googleLocationId })) });
    return round(this.randomizeTripLength(distance / 1000));
  }

  async descriptions(): Promise<string[]> {
    try {
      return await this.#api.getDescriptions(10);
    } catch (error) {
      return [];
    }
  }

  async getHistoricalData(licencePlate: string): Promise<HistoricalData | null> {
    try {
      return await this.#api.getHistoricalData(licencePlate);
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  private randomizeTripLength(value: number): number {
    return value + (value / 10) * Math.random();
  }

  newTransportationRouteSheet(): TransportationRouteSheet {
    return {
      _id: '',
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      fuelRemainingStartLitres: 0,
      driver: this.#driverService.newTransportationDriver(),
      vehicle: this.#vehicleService.newTransportationVehicle(),
      trips: [],
      fuelPurchases: [],
    };
  }
}
