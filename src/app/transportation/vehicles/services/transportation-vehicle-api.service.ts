import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';
import { inject, Service, Signal } from '@angular/core';
import { SchemaPath } from '@angular/forms/signals';
import { isEqual } from 'lodash-es';
import { firstValueFrom, Observable, switchMap } from 'rxjs';
import { getAppParams } from 'src/app/app-params';
import { pluckDeletedCount } from 'src/app/interfaces';
import {
  httpFilterSignal,
  httpResponseRequest,
  rxId,
  rxValidator,
  validateAsync,
  validateId,
  validatePropertyHttp,
  validatorFn,
} from 'src/app/library';
import {
  Vehicle,
  VehicleCreate,
  VehicleCreateSchema,
  VehicleList,
  VehicleListSchema,
  VehicleSchema,
  VehicleUpdate,
  VehicleUpdateSchema,
} from '../schemas/transportation-vehicle';
import { VehiclesQuery, VehiclesQuerySchema } from '../schemas/vehicles-query.schema';
import { VehicleEdit, VehicleEditSchema } from '../transportation-vehicle-edit/vehicle-edit.model';

@Service()
export class TransportationVehicleApiService {
  readonly #path = getAppParams('apiPath') + 'transportation/vehicle/';
  #http = inject(HttpClient);

  vehiclesResource(filter: Signal<VehiclesQuery | undefined>): HttpResourceRef<VehicleList[] | undefined> {
    const query = httpFilterSignal(VehiclesQuerySchema, filter);
    return httpResource(() => httpResponseRequest(this.#path, query().cacheable()), {
      parse: validatorFn([VehicleListSchema]),
      equal: isEqual,
    });
  }

  vehicleResource(id: Signal<string>): HttpResourceRef<Vehicle | undefined> {
    return httpResource(() => httpResponseRequest(`${this.#path}/${id()}`), {
      parse: validatorFn(VehicleSchema),
    });
  }

  getOne(id: string): Observable<Vehicle> {
    return rxId(id).pipe(
      switchMap((i) => this.#http.get(this.#path + i)),
      rxValidator(VehicleSchema),
    );
  }

  createOne(create: VehicleCreate): Promise<Vehicle> {
    const data = VehicleCreateSchema.encode(create);
    const response = this.#http.put(this.#path, data);
    return validateAsync(VehicleSchema, response);
  }

  updateOne(id: string, update: VehicleUpdate): Promise<Vehicle> {
    const data = VehicleUpdateSchema.encode(update);
    const response = this.#http.patch(this.#path + id, data);
    return validateAsync(VehicleSchema, response);
  }

  async deleteOne(id: string): Promise<number> {
    const data = validateId(id);
    const result$ = this.#http.delete<{ deletedCount: number }>(this.#path + data).pipe(pluckDeletedCount());
    return firstValueFrom(result$);
  }

  validate<K extends keyof Pick<VehicleEdit, 'name' | 'licencePlate' | 'passportNumber' | 'vin'>>(
    path: SchemaPath<VehicleEdit[K]>,
    key: K,
  ) {
    validatePropertyHttp(this.#path, path, key, VehicleEditSchema.shape[key]);
  }
}
