import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { HttpOptions, httpResponseRequest, ValidatorService } from 'src/app/library';
import { TransportationDriver, TransportationDriverCreate, transportationDriverSchema, TransportationDriverUpdate } from '../interfaces/transportation-driver';
import { isEqual } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class TransportationDriverApiService {
  readonly #path = getAppParams('apiPath') + 'transportation/driver';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  driversResource(params: Signal<Record<string, any>>) {
    return httpResource(() => httpResponseRequest(this.#path, new HttpOptions(params()).cacheable()), {
      defaultValue: [],
      parse: this.#validator.arrayValidatorFn(transportationDriverSchema),
      equal: isEqual,
    });
  }

  async getAll(): Promise<TransportationDriver[]> {
    const response = this.#http.get<Record<string, any>[]>(this.#path, new HttpOptions().cacheable());
    return this.#validator.validateArrayAsync(transportationDriverSchema, response);
  }

  async getOne(id: string): Promise<TransportationDriver> {
    const response = this.#http.get<Record<string, any>>(`${this.#path}/${id}`, new HttpOptions().cacheable());
    return this.#validator.validateAsync(transportationDriverSchema, response);
  }

  async createOne(data: TransportationDriverCreate): Promise<TransportationDriver> {
    const response = this.#http.put(this.#path, data, new HttpOptions());
    return this.#validator.validateAsync(transportationDriverSchema, response);
  }

  async updateOne(id: string, data: TransportationDriverUpdate): Promise<TransportationDriver> {
    const response = this.#http.patch(`${this.#path}/${id}`, data, new HttpOptions());
    return this.#validator.validateAsync(transportationDriverSchema, response);
  }

  async deleteOne(id: string): Promise<number> {
    const { deletedCount } = await firstValueFrom(this.#http.delete<{ deletedCount: number }>(`${this.#path}/${id}`, new HttpOptions()));
    return deletedCount;
  }

  async validate<K extends keyof TransportationDriver>(key: K) {
    const data = this.#http.get<TransportationDriver[K][]>(`${this.#path}/validate/${key}`, new HttpOptions().cacheable());
    return firstValueFrom(data);
  }
}
