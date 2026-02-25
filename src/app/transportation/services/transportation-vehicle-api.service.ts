import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { HttpOptions, httpResponseRequest, ValidatorService } from 'src/app/library';
import {
  TransportationVehicle,
  TransportationVehicleCreate,
  TransportationVehicleUpdate,
} from '../interfaces/transportation-vehicle';
import { SchemaPath, validateHttp, ValidationError } from '@angular/forms/signals';

const NETWORK_ERROR: ValidationError = { kind: 'network_error', message: 'Tīkla kļūda' };

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
      equal: isEqual,
    });
  }

  vehicleResource(id: Signal<string | undefined>) {
    return httpResource(() => (id() ? httpResponseRequest(`${this.#path}/${id()}`) : undefined), {
      parse: this.#validator.validatorFn(TransportationVehicle),
    });
  }

  getOne(id: string): Promise<TransportationVehicle> {
    const response = this.#http.get<Record<string, any>>(`${this.#path}/${id}`, new HttpOptions());
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
    const { deletedCount } = await firstValueFrom(
      this.#http.delete<{ deletedCount: number }>(`${this.#path}/${id}`, new HttpOptions()),
    );
    return deletedCount;
  }

  validate<K extends keyof Pick<TransportationVehicle, 'name' | 'licencePlate' | 'passportNumber' | 'vin'>>(
    path: SchemaPath<TransportationVehicle[K]>,
    key: K,
  ) {
    validateHttp(path, {
      request: () => httpResponseRequest(`${this.#path}/validate/${key}`, new HttpOptions().cacheable()),
      onSuccess: (response: TransportationVehicle[K][], { value }) => {
        const current = value()?.toUpperCase();
        if (response.some((r) => r && r.toUpperCase() === current)) {
          return {
            kind: 'used',
            message: `"${value()}" jau tiek izmantots!`,
          };
        }
      },
      onError: () => NETWORK_ERROR,
    });
  }
}
