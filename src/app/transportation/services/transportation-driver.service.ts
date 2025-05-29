import { inject, Injectable } from '@angular/core';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { TransportationDriver, TransportationDriverCreate, TransportationDriverUpdate } from '../interfaces/transportation-driver';
import { TransportationDriverApiService } from './transportation-driver-api.service';

export interface TransportationDriverRequestFilter {
  name?: string;
  email?: string;
  disabled?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TransportationDriverService {
  #api = inject(TransportationDriverApiService);

  getDriversResource(filter?: FilterInput<TransportationDriverRequestFilter>) {
    return this.#api.driversResource(toFilterSignal(filter));
  }

  getDriver(id: string) {
    return this.#api.getOne(id);
  }

  create(driver: TransportationDriverCreate) {
    return this.#api.createOne(driver);
  }

  update(id: string, update: TransportationDriverUpdate) {
    return this.#api.updateOne(id, update);
  }

  delete(id: string) {
    return this.#api.deleteOne(id);
  }

  async validateName(name: string): Promise<boolean> {
    const names = await this.#api.validate('name');
    return names.every((n) => n.toUpperCase() !== name.toUpperCase());
  }

  newTransportationDriver(): TransportationDriver {
    return {
      _id: '',
      name: '',
      disabled: false,
    };
  }
}
