import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { SchemaPath } from '@angular/forms/signals';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import {
  Equipment,
  EquipmentCreate,
  EquipmentCreateSchema,
  EquipmentList,
  EquipmentListSchema,
  EquipmentSchema,
  EquipmentUpdate,
  EquipmentUpdateSchema,
  pluckDeletedCount,
} from 'src/app/interfaces';
import { EquipmentFilter, EquipmentFilterSchema } from 'src/app/jobs-admin/equipment/services/equipment-filter.schema';
import {
  cacheable,
  httpFilterSignal,
  httpResponseRequest,
  validateAsync,
  validatePropertyHttp,
  validatorFn,
} from 'src/app/library';

@Service()
export class EquipmentApiService {
  #path = getAppParams('apiPath') + 'equipment/';
  #http = inject(HttpClient);

  equipmentResource(filter: Signal<EquipmentFilter | undefined>): HttpResourceRef<EquipmentList[] | undefined> {
    const query = httpFilterSignal(EquipmentFilterSchema, filter);
    return httpResource(() => httpResponseRequest(this.#path, query().cacheable()), {
      parse: validatorFn(EquipmentListSchema.array()),
      equal: isEqual,
    });
  }

  getOne(id: string): Promise<Equipment> {
    return validateAsync(EquipmentSchema, this.#http.get(this.#path + id, cacheable()));
  }

  updateOne(id: string, update: EquipmentUpdate): Promise<Equipment> {
    const data = EquipmentUpdateSchema.encode(update);
    const response$ = this.#http.patch(this.#path + id, data);
    return validateAsync(EquipmentSchema, response$);
  }

  insertOne(create: EquipmentCreate): Promise<Equipment> {
    const data = EquipmentCreateSchema.encode(create);
    const response$ = this.#http.put(this.#path, data);
    return validateAsync(EquipmentSchema, response$);
  }

  deleteOne(id: string): Promise<number> {
    const response$ = this.#http.delete(this.#path + id).pipe(pluckDeletedCount());
    return firstValueFrom(response$);
  }

  validate<K extends keyof Pick<Equipment, 'name'>>(schema: SchemaPath<Equipment[K]>, key: K): void {
    validatePropertyHttp(this.#path, schema, key, EquipmentSchema.shape[key]);
  }
}
