import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { Equipment, EquipmentCreate, pluckDeletedCount } from 'src/app/interfaces';
import { EquipmentFilter, EquipmentFilterSchema } from 'src/app/jobs-admin/equipment/services/equipmanet-filter.schema';
import { cacheable, httpFilterSignal, httpResponseRequest, validateAsync, validatorFn } from 'src/app/library';

@Service()
export class EquipmentApiService {
  #path = getAppParams('apiPath') + 'equipment/';
  #http = inject(HttpClient);

  equipmentResource(filter: Signal<EquipmentFilter | undefined>): HttpResourceRef<Equipment[]> {
    const query = httpFilterSignal(EquipmentFilterSchema, filter);
    return httpResource(() => httpResponseRequest(this.#path, query().cacheable()), {
      defaultValue: [],
      parse: validatorFn(Equipment.array()),
      equal: isEqual,
    });
  }

  getOne(id: string): Promise<Equipment> {
    return validateAsync(Equipment, this.#http.get(this.#path + id, cacheable()));
  }

  updateOne(id: string, data: Partial<Equipment>): Promise<Equipment> {
    const response$ = this.#http.patch(this.#path + id, data);
    return validateAsync(Equipment, response$);
  }

  insertOne(data: EquipmentCreate): Promise<Equipment> {
    const response$ = this.#http.put(this.#path, data);
    return validateAsync(Equipment, response$);
  }

  deleteOne(id: string): Promise<number> {
    const response$ = this.#http.delete(this.#path + id).pipe(pluckDeletedCount());
    return firstValueFrom(response$);
  }

  validatorData<K extends keyof Equipment>(key: K): Promise<Equipment[K][]> {
    const response$ = this.#http.get<Equipment[K][]>(this.#path + 'validate/' + key, cacheable());
    return firstValueFrom(response$);
  }
}
