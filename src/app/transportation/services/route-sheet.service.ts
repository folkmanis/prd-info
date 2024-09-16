import { inject, Injectable, signal } from '@angular/core';
import { RouteTripStop, TransportationRouteSheet } from '../interfaces/transportation-route-sheet';
import { RouteSheetApiService } from './route-sheet-api.service';
import { round } from 'lodash-es';

interface RouteSheetFilter {
  name?: string;
  fuelTypes?: string[];
  year?: number;
  month?: number;
}

@Injectable({
  providedIn: 'root',
})
export class RouteSheetService {
  private api = inject(RouteSheetApiService);
  private filter: RouteSheetFilter = {};
  #routeSheets = signal<TransportationRouteSheet[]>([]);
  routeSheets = this.#routeSheets.asReadonly();

  async setFilter(filter: RouteSheetFilter) {
    this.filter = filter;
    await this.getAllRouteSheets();
  }

  async getRouteSheet(id: string) {
    return this.api.getOne(id);
  }

  async getCustomers() {
    return await this.api.getCustomers();
  }

  async createRouteSheet(routeSheet: Omit<TransportationRouteSheet, '_id'>): Promise<TransportationRouteSheet> {
    const created = await this.api.createOne(routeSheet);
    this.getAllRouteSheets();
    return created;
  }

  async deleteRouteSheet(id: string): Promise<number> {
    const deletedCount = await this.api.deleteOne(id);
    if (deletedCount > 0) {
      this.getAllRouteSheets();
      return deletedCount;
    } else {
      throw new Error(`${id} not found`);
    }
  }

  async updateRouteSheet(_id: string, routeSheet: Omit<Partial<TransportationRouteSheet>, 'id'>): Promise<TransportationRouteSheet> {
    const updated = await this.api.updateOne({ _id, ...routeSheet });
    this.getAllRouteSheets();
    return updated;
  }

  async getTripLength(stops: RouteTripStop[]): Promise<number> {
    const { distance } = await this.api.distanceRequest({ tripStops: stops.map(({ address, googleLocationId }) => ({ address, googleLocationId })) });
    return round(this.randomizeTripLength(distance / 1000));
  }

  private async getAllRouteSheets() {
    const { name, year, month, fuelTypes } = this.filter;
    const routeSheets = await this.api.getAll({
      name,
      year: year?.toString(),
      month: month?.toString(),
      fuelTypes: fuelTypes ? fuelTypes.join(',') : undefined,
    });
    this.#routeSheets.set(routeSheets);
    return routeSheets;
  }

  private randomizeTripLength(value: number): number {
    return value + (value / 10) * Math.random();
  }
}
