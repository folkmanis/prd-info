import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { pluckDeletedCount } from 'src/app/interfaces';
import {
  cacheable,
  httpFilterSignal,
  httpResponseRequest,
  validateAsync,
  validatePropertyHttp,
  validatorFn,
} from 'src/app/library';
import {
  Driver,
  DriverCreate,
  DriverCreateSchema,
  DriverList,
  DriverListSchema,
  DriverSchema,
  DriverUpdate,
  DriverUpdateSchema,
} from '../schemas/transportation-driver';
import { SchemaPath } from '@angular/forms/signals';
import { DriverQuery, DriverQuerySchema } from '../schemas/drivers.query.schema';
import { DriverModel, DriverModelSchema } from '../transportation-driver-edit/driver-edit.model';

@Service()
export class TransportationDriverApiService {
  readonly #path = getAppParams('apiPath') + 'transportation/driver/';
  #http = inject(HttpClient);

  driversResource(filter: Signal<DriverQuery | undefined>): HttpResourceRef<DriverList[] | undefined> {
    const query = httpFilterSignal(DriverQuerySchema, filter);
    return httpResource(() => httpResponseRequest(this.#path, query().cacheable()), {
      parse: validatorFn(DriverListSchema.array()),
      equal: isEqual,
    });
  }

  async getOne(id: string): Promise<Driver> {
    const response = this.#http.get(this.#path + id, cacheable());
    return validateAsync(DriverSchema, response);
  }

  async createOne(create: DriverCreate): Promise<Driver> {
    const data = DriverCreateSchema.encode(create);
    const response = this.#http.put(this.#path, data);
    return validateAsync(DriverSchema, response);
  }

  async updateOne(id: string, update: DriverUpdate): Promise<Driver> {
    const data = DriverUpdateSchema.encode(update);
    const response = this.#http.patch(this.#path + id, data);
    return validateAsync(DriverSchema, response);
  }

  async deleteOne(id: string): Promise<number> {
    const data$ = this.#http.delete(this.#path + id).pipe(pluckDeletedCount());
    return firstValueFrom(data$);
  }

  validate<K extends keyof Pick<DriverModel, 'name'>>(schema: SchemaPath<DriverModel[K]>, key: K): void {
    validatePropertyHttp(this.#path, schema, key, DriverModelSchema.shape[key]);
  }
}
