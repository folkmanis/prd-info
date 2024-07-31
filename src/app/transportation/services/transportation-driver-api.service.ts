import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { getAppParams } from 'src/app/app-params';
import { AppClassTransformerService, HttpOptions } from 'src/app/library';
import { TransportationDriver } from '../interfaces/transportation-driver';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransportationDriverApiService {
  private readonly path = getAppParams('apiPath') + 'transportation/driver';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  async getAll(): Promise<TransportationDriver[]> {
    const response = this.http.get<Record<string, any>[]>(this.path, new HttpOptions().cacheable());
    return this.transformer.toInstanceAsync(TransportationDriver, response);
  }

  async getOne(id: string): Promise<TransportationDriver> {
    const response = this.http.get<Record<string, any>>(`${this.path}/${id}`, new HttpOptions().cacheable());
    return this.transformer.toInstanceAsync(TransportationDriver, response);
  }

  async createOne(data: Omit<TransportationDriver, 'id'>): Promise<TransportationDriver> {
    const response = this.http.put(this.path, this.transformer.instanceToPlain(data), new HttpOptions());
    return this.transformer.toInstanceAsync(TransportationDriver, response);
  }

  async updateOne(id: string, data: Partial<TransportationDriver>): Promise<TransportationDriver> {
    const response = this.http.patch(`${this.path}/${id}`, this.transformer.instanceToPlain(data), new HttpOptions());
    return this.transformer.toInstanceAsync(TransportationDriver, response);
  }

  async deleteOne(id: string): Promise<number> {
    const { deletedCount } = await firstValueFrom(this.http.delete<{ deletedCount: number }>(`${this.path}/${id}`, new HttpOptions()));
    return deletedCount;
  }

  async validate<K extends keyof TransportationDriver>(key: K) {
    const data = this.http.get<TransportationDriver[K][]>(`${this.path}/validate/${key}`, new HttpOptions().cacheable());
    return firstValueFrom(data);
  }
}
