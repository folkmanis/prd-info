import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, map } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Equipment, EquipmentCreate } from 'src/app/interfaces';
import { HttpOptions, httpResponseRequest, ValidatorService } from 'src/app/library';

@Injectable({
  providedIn: 'root',
})
export class EquipmentApiService {
  #path = getAppParams('apiPath') + 'equipment/';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  equipmentResource(filterSignal: Signal<Record<string, any>>): HttpResourceRef<Equipment[]> {
    return httpResource(() => httpResponseRequest(this.#path, new HttpOptions(filterSignal()).cacheable()), {
      defaultValue: [],
      parse: this.#validator.arrayValidatorFn(Equipment),
      equal: isEqual,
    });
  }

  getOne(id: string): Promise<Equipment> {
    return this.#validator.validateAsync(Equipment, this.#http.get(this.#path + id, new HttpOptions().cacheable()));
  }

  updateOne(id: string, data: Partial<Equipment>): Promise<Equipment> {
    const response$ = this.#http.patch<Record<string, any>>(this.#path + id, data, new HttpOptions());
    return this.#validator.validateAsync(Equipment, response$);
  }

  insertOne(data: EquipmentCreate): Promise<Equipment> {
    const response$ = this.#http.put<Record<string, any>>(this.#path, data, new HttpOptions());
    return this.#validator.validateAsync(Equipment, response$);
  }

  deleteOne(id: string): Promise<number> {
    const response$ = this.#http.delete<{ deletedCount: number }>(this.#path + id, new HttpOptions()).pipe(map((data) => data.deletedCount));
    return firstValueFrom(response$);
  }

  validatorData<K extends keyof Equipment>(key: K): Promise<Equipment[K][]> {
    const response$ = this.#http.get<Equipment[K][]>(this.#path + 'validate/' + key, new HttpOptions().cacheable());
    return firstValueFrom(response$);
  }
}
