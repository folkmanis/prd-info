import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom, Observable, switchMap } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { pluckDeletedCount } from 'src/app/interfaces';
import {
  cacheable,
  httpFilterSignal,
  httpResponseRequest,
  rxId,
  rxValidator,
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

  getOne(id: unknown): Observable<Driver> {
    return rxId(id).pipe(
      switchMap((i) => this.#http.get(this.#path + i, cacheable())),
      rxValidator(DriverSchema),
    );
  }

  createOne(create: DriverCreate): Promise<Driver> {
    const data = DriverCreateSchema.encode(create);
    const response = this.#http.put(this.#path, data);
    return validateAsync(DriverSchema, response);
  }

  updateOne(id: string, update: DriverUpdate): Promise<Driver> {
    const data = DriverUpdateSchema.encode(update);
    const response = rxId(id).pipe(switchMap((i) => this.#http.patch(this.#path + i, data)));
    return validateAsync(DriverSchema, response);
  }

  async deleteOne(id: string): Promise<number> {
    const data$ = rxId(id).pipe(
      switchMap((i) => this.#http.delete(this.#path + id)),
      pluckDeletedCount(),
    );
    return firstValueFrom(data$);
  }

  validate<K extends keyof Pick<DriverModel, 'name'>>(schema: SchemaPath<DriverModel[K]>, key: K): void {
    validatePropertyHttp(this.#path, schema, key, DriverModelSchema.shape[key]);
  }
}
