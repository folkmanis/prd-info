import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Equipment } from 'src/app/interfaces';
import { AppClassTransformerService } from 'src/app/library';
import { HttpOptions, httpResponseRequest } from 'src/app/library/http';

@Injectable({
  providedIn: 'root',
})
export class EquipmentApiService {
  private path = getAppParams('apiPath') + 'equipment/';
  private http = inject(HttpClient);
  private transformer = inject(AppClassTransformerService);

  equipmentResource(filterSignal: Signal<Record<string, any>>): HttpResourceRef<Equipment[]> {
    return httpResource(() => httpResponseRequest(this.path, new HttpOptions(filterSignal()).cacheable()), {
      defaultValue: [],
      parse: (data: Record<string, any>[]) => this.transformer.plainToInstance(Equipment, data),
      equal: isEqual,
    });
  }

  getOne(id: string): Promise<Equipment> {
    return this.transformer.toInstanceAsync(Equipment, this.http.get(this.path + id, new HttpOptions().cacheable()));
  }

  updateOne(id: string, data: Partial<Equipment>): Promise<Equipment> {
    const response$ = this.http.patch<Record<string, any>>(this.path + id, data, new HttpOptions());
    return this.transformer.toInstanceAsync(Equipment, response$);
  }

  insertOne(data: Omit<Equipment, '_id'>): Promise<Equipment> {
    const response$ = this.http.put<Record<string, any>>(this.path, data, new HttpOptions());
    return this.transformer.toInstanceAsync(Equipment, response$);
  }

  deleteOne(id: string): Promise<number> {
    const response$ = this.http.delete<{ deletedCount: number }>(this.path + id, new HttpOptions()).pipe(map((data) => data.deletedCount));
    return firstValueFrom(response$);
  }

  validatorData<K extends keyof Equipment>(key: K): Promise<Equipment[K][]> {
    const response$ = this.http.get<Equipment[K][]>(this.path + 'validate/' + key, new HttpOptions().cacheable());
    return firstValueFrom(response$);
  }
}
