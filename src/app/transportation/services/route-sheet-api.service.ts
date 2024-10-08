import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getAppParams } from 'src/app/app-params';
import { AppClassTransformerService, HttpOptions } from 'src/app/library';
import { TransportationCustomer } from '../interfaces/transportation-customer';
import { RouteTripStop, TransportationRouteSheet } from '../interfaces/transportation-route-sheet';
import { firstValueFrom } from 'rxjs';
import { HistoricalData } from '../interfaces/historical-data';

@Injectable({
  providedIn: 'root',
})
export class RouteSheetApiService {
  private readonly path = getAppParams('apiPath') + 'transportation';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  async getAll(filter: Record<string, string>): Promise<TransportationRouteSheet[]> {
    const response$ = this.http.get<Record<string, any>[]>(this.path, new HttpOptions(filter));
    return this.transformer.toInstanceAsync(TransportationRouteSheet, response$);
  }

  async getOne(id: string): Promise<TransportationRouteSheet> {
    const response$ = this.http.get<Record<string, any>>(`${this.path}/${id}`, new HttpOptions());
    return this.transformer.toInstanceAsync(TransportationRouteSheet, response$);
  }

  async createOne(data: Omit<TransportationRouteSheet, '_id'>) {
    const response$ = this.http.put<Record<string, any>>(this.path, data, new HttpOptions());
    return this.transformer.toInstanceAsync(TransportationRouteSheet, response$);
  }

  async updateOne(data: Pick<TransportationRouteSheet, '_id'> & Partial<TransportationRouteSheet>): Promise<TransportationRouteSheet> {
    const { _id: id, ...rest } = data;
    const response$ = this.http.patch<Record<string, any>>(`${this.path}/${id}`, rest, new HttpOptions());
    return this.transformer.toInstanceAsync(TransportationRouteSheet, response$);
  }

  async deleteOne(id: string): Promise<number> {
    const response$ = this.http.delete<{ deletedCount: number }>(`${this.path}/${id}`, new HttpOptions());
    const { deletedCount } = await firstValueFrom(response$);
    return deletedCount;
  }

  async getCustomers() {
    const response$ = this.http.get<Record<string, any>[]>(this.path + '/customers', new HttpOptions().cacheable());
    return this.transformer.toInstanceAsync(TransportationCustomer, response$);
  }

  async distanceRequest(request: { tripStops: Pick<RouteTripStop, 'address' | 'googleLocationId'>[] }): Promise<{ distance: number }> {
    const response$ = this.http.post<{ distance: number }>(this.path + '/distance-request', request, new HttpOptions());
    return await firstValueFrom(response$);
  }

  async getDescriptions(count?: number): Promise<string[]> {
    const response$ = this.http.get<string[]>(this.path + '/descriptions', new HttpOptions({ count }).cacheable());
    return await firstValueFrom(response$);
  }

  async getHistoricalData(licencePlate: string): Promise<HistoricalData> {
    const response$ = this.http.get<HistoricalData>(this.path + '/historical-data/' + licencePlate, new HttpOptions());
    return this.transformer.toInstanceAsync(HistoricalData, response$);
  }
}
