import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { HttpOptions, httpResponseRequest, ValidatorService } from 'src/app/library';
import { TransportationVehicle, TransportationVehicleCreate, TransportationVehicleUpdate } from '../interfaces/transportation-vehicle';

@Injectable({
  providedIn: 'root',
})
export class TransportationVehicleApiService {
  readonly #path = getAppParams('apiPath') + 'transportation/vehicle';
  #http = inject(HttpClient);
  #validator = inject(ValidatorService);

  vehiclesResource(params: Signal<Record<string, any>>) {
    return httpResource(() => httpResponseRequest(this.#path, new HttpOptions(params()).cacheable()), {
      parse: this.#validator.arrayValidatorFn(TransportationVehicle),
      defaultValue: [],
      equal: isEqual,
    });
  }

  getOne(id: string): Promise<TransportationVehicle> {
    const response = this.#http.get<Record<string, any>>(`${this.#path}/${id}`, new HttpOptions().cacheable());
    return this.#validator.validateAsync(TransportationVehicle, response);
  }

  createOne(data: TransportationVehicleCreate): Promise<TransportationVehicle> {
    const response = this.#http.put(this.#path, data, new HttpOptions());
    return this.#validator.validateAsync(TransportationVehicle, response);
  }

  updateOne(id: string, data: TransportationVehicleUpdate): Promise<TransportationVehicle> {
    const response = this.#http.patch(`${this.#path}/${id}`, data, new HttpOptions());
    return this.#validator.validateAsync(TransportationVehicle, response);
  }

  async deleteOne(id: string): Promise<number> {
    const { deletedCount } = await firstValueFrom(this.#http.delete<{ deletedCount: number }>(`${this.#path}/${id}`, new HttpOptions()));
    return deletedCount;
  }

  validate<K extends keyof TransportationVehicle>(key: K) {
    const data = this.#http.get<TransportationVehicle[K][]>(`${this.#path}/validate/${key}`, new HttpOptions().cacheable());
    return firstValueFrom(data);
  }
}
