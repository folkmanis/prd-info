import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getAppParams } from 'src/app/app-params';
import { AppClassTransformerService, HttpOptions } from 'src/app/library';
import { TransportationVehicle } from '../interfaces/transportation-vehicle';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransportationVehicleApiService {
  private readonly path = getAppParams('apiPath') + 'transportation/vehicle';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  async getAll(): Promise<TransportationVehicle[]> {
    const response = this.http.get<Record<string, any>[]>(this.path, new HttpOptions().cacheable());
    return this.transformer.toInstanceAsync(TransportationVehicle, response);
  }

  async getOne(id: string): Promise<TransportationVehicle> {
    const response = this.http.get<Record<string, any>>(`${this.path}/${id}`, new HttpOptions().cacheable());
    return this.transformer.toInstanceAsync(TransportationVehicle, response);
  }

  async createOne(data: Omit<TransportationVehicle, 'id'>): Promise<TransportationVehicle> {
    const response = this.http.put(this.path, this.transformer.instanceToPlain(data), new HttpOptions());
    return this.transformer.toInstanceAsync(TransportationVehicle, response);
  }

  async updateOne(id: string, data: Partial<TransportationVehicle>): Promise<TransportationVehicle> {
    const response = this.http.patch(`${this.path}/${id}`, this.transformer.instanceToPlain(data), new HttpOptions());
    return this.transformer.toInstanceAsync(TransportationVehicle, response);
  }

  async deleteOne(id: string): Promise<number> {
    const { deletedCount } = await firstValueFrom(this.http.delete<{ deletedCount: number }>(`${this.path}/${id}`, new HttpOptions()));
    return deletedCount;
  }

  async validate<K extends keyof TransportationVehicle>(key: K) {
    const data = this.http.get<TransportationVehicle[K][]>(`${this.path}/validate/${key}`, new HttpOptions().cacheable());
    return firstValueFrom(data);
  }
}
