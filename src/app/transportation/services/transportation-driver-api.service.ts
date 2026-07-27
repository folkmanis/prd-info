import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { pluckDeletedCount } from 'src/app/interfaces';
import { cacheable, httpFilterSignal, httpResponseRequest, validateAsync, validatorFn } from 'src/app/library';
import { z } from 'zod';
import {
  TransportationDriver,
  TransportationDriverCreate,
  TransportationDriverSchema,
  TransportationDriverUpdate,
} from '../interfaces/transportation-driver';

const TransportationDriverRequestFilterSchema = z
  .object({
    name: z.string(),
    email: z.string(),
    disabled: z.stringbool(),
  })
  .partial();
export type TransportationDriverRequestFilter = z.infer<typeof TransportationDriverRequestFilterSchema>;

@Service()
export class TransportationDriverApiService {
  readonly #path = getAppParams('apiPath') + 'transportation/driver';
  #http = inject(HttpClient);

  driversResource(
    filter: Signal<TransportationDriverRequestFilter | undefined>,
  ): HttpResourceRef<TransportationDriver[] | undefined> {
    const query = httpFilterSignal(TransportationDriverRequestFilterSchema, filter);
    return httpResource(() => httpResponseRequest(this.#path, query().cacheable()), {
      parse: validatorFn(TransportationDriverSchema.array()),
      equal: isEqual,
    });
  }

  async getOne(id: string): Promise<TransportationDriver> {
    const response = this.#http.get(`${this.#path}/${id}`, cacheable());
    return validateAsync(TransportationDriverSchema, response);
  }

  async createOne(data: TransportationDriverCreate): Promise<TransportationDriver> {
    const response = this.#http.put(this.#path, data);
    return validateAsync(TransportationDriverSchema, response);
  }

  async updateOne(id: string, data: TransportationDriverUpdate): Promise<TransportationDriver> {
    const response = this.#http.patch(`${this.#path}/${id}`, data);
    return validateAsync(TransportationDriverSchema, response);
  }

  async deleteOne(id: string): Promise<number> {
    const data$ = this.#http.delete(`${this.#path}/${id}`).pipe(pluckDeletedCount());
    return firstValueFrom(data$);
  }

  async validate<K extends keyof TransportationDriver>(key: K) {
    const data = this.#http.get<TransportationDriver[K][]>(`${this.#path}/validate/${key}`, cacheable());
    return firstValueFrom(data);
  }
}
