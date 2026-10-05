import { inject, Service } from '@angular/core';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { Driver, DriverCreate, DriverUpdate } from '../schemas/transportation-driver';
import { TransportationDriverApiService } from './transportation-driver-api.service';
import { DriverQuery } from '../schemas/drivers.query.schema';
import { SchemaPath } from '@angular/forms/signals';
import { DriverModel } from '../transportation-driver-edit/driver-edit.model';

@Service()
export class TransportationDriverService {
  #api = inject(TransportationDriverApiService);

  getDriversResource(filter?: FilterInput<DriverQuery>) {
    return this.#api.driversResource(toFilterSignal(filter));
  }

  getDriver(id: string) {
    return this.#api.getOne(id);
  }

  create(driver: DriverCreate) {
    return this.#api.createOne(driver);
  }

  update(id: string, update: DriverUpdate) {
    return this.#api.updateOne(id, update);
  }

  delete(id: string) {
    return this.#api.deleteOne(id);
  }

  validate<K extends keyof Pick<DriverModel, 'name'>>(schema: SchemaPath<DriverModel[K]>, key: K): void {
    this.#api.validate(schema, key);
  }

  newTransportationDriver(): Driver {
    return {
      _id: '',
      name: '',
      disabled: false,
    };
  }
}
