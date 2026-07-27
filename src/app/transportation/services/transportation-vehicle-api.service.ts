import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { SchemaPath, validateHttp } from '@angular/forms/signals';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { pluckDeletedCount } from 'src/app/interfaces';
import { cacheable, httpFilterSignal, httpResponseRequest, validateAsync, validatorFn } from 'src/app/library';
import { z } from 'zod';
import { NETWORK_ERROR } from '../../library/http/network-error';
import {
  TransportationVehicle,
  TransportationVehicleCreate,
  TransportationVehicleSchema,
  TransportationVehicleUpdate,
} from '../interfaces/transportation-vehicle';

const VehiclesFilterSchema = z
  .object({
    name: z.string(),
    licencePlate: z.string(),
    fuelType: z.string(),
    disabled: z.stringbool(),
  })
  .partial();
export type VehiclesFilter = z.infer<typeof VehiclesFilterSchema>;

@Service()
export class TransportationVehicleApiService {
  readonly #path = getAppParams('apiPath') + 'transportation/vehicle';
  #http = inject(HttpClient);

  vehiclesResource(filter: Signal<VehiclesFilter | undefined>): HttpResourceRef<TransportationVehicle[] | undefined> {
    const query = httpFilterSignal(VehiclesFilterSchema, filter);
    return httpResource(() => httpResponseRequest(this.#path, query().cacheable()), {
      parse: validatorFn(TransportationVehicleSchema.array()),
      equal: isEqual,
    });
  }

  vehicleResource(id: Signal<string | undefined>) {
    return httpResource(() => (id() ? httpResponseRequest(`${this.#path}/${id()}`) : undefined), {
      parse: validatorFn(TransportationVehicleSchema),
    });
  }

  getOne(id: string): Promise<TransportationVehicle> {
    const response = this.#http.get(`${this.#path}/${id}`);
    return validateAsync(TransportationVehicleSchema, response);
  }

  createOne(data: TransportationVehicleCreate): Promise<TransportationVehicle> {
    const response = this.#http.put(this.#path, data);
    return validateAsync(TransportationVehicleSchema, response);
  }

  updateOne(id: string, data: TransportationVehicleUpdate): Promise<TransportationVehicle> {
    const response = this.#http.patch(`${this.#path}/${id}`, data);
    return validateAsync(TransportationVehicleSchema, response);
  }

  async deleteOne(id: string): Promise<number> {
    const result$ = this.#http.delete<{ deletedCount: number }>(`${this.#path}/${id}`).pipe(pluckDeletedCount());
    return firstValueFrom(result$);
  }

  validate<K extends keyof Pick<TransportationVehicle, 'name' | 'licencePlate' | 'passportNumber' | 'vin'>>(
    path: SchemaPath<TransportationVehicle[K]>,
    key: K,
  ) {
    validateHttp(path, {
      request: () => httpResponseRequest(`${this.#path}/validate/${key}`, cacheable()),
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
