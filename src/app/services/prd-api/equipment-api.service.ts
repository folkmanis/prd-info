import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Equipment } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions } from 'src/app/library/http';

@Injectable({
  providedIn: 'root',
})
export class EquipmentApiService {
  private path = getAppParams('apiPath') + 'equipment/';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  async getOne(id: string): Promise<Equipment> {
    return this.transformer.toInstanceAsync(Equipment, this.http.get(this.path + id, new HttpOptions().cacheable()));
  }

  async getAll(filter: Record<string, any>): Promise<Equipment[]> {
    const data$ = this.http.get<Record<string, any>[]>(this.path, new HttpOptions(filter).cacheable());
    return this.transformer.toInstanceAsync(Equipment, data$);
  }

  async updateOne(id: string, data: Partial<Equipment>): Promise<Equipment> {
    const response$ = this.http.patch<Record<string, any>>(this.path + id, data, new HttpOptions());
    return this.transformer.toInstanceAsync(Equipment, response$);
  }

  async insertOne(data: Omit<Equipment, '_id'>): Promise<Equipment> {
    const response$ = this.http.put<Record<string, any>>(this.path, data, new HttpOptions());
    return this.transformer.toInstanceAsync(Equipment, response$);
  }

  async deleteOne(id: string): Promise<number> {
    const response$ = this.http.delete<{ deletedCount: number }>(this.path + id, new HttpOptions());
    const data = await firstValueFrom(response$);
    return data.deletedCount;
  }

  async validatorData<K extends keyof Equipment>(key: K): Promise<Equipment[K][]> {
    const response$ = this.http.get<Equipment[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable());
    return firstValueFrom(response$);
  }
}
