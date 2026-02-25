import { computed, inject, Injectable, Signal } from '@angular/core';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { configuration } from 'src/app/services/config.provider';
import {
  TransportationVehicle,
  TransportationVehicleCreate,
  TransportationVehicleUpdate,
} from '../interfaces/transportation-vehicle';
import { TransportationVehicleApiService } from './transportation-vehicle-api.service';
import { applyWhen, SchemaPath } from '@angular/forms/signals';

export interface VehiclesFilter {
  name?: string;
  licencePlate?: string;
  fuelType?: string;
  disabled?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TransportationVehicleService {
  #api = inject(TransportationVehicleApiService);

  #fuelTypes = configuration('transportation', 'fuelTypes');
  fuelTypes = computed(() => [...this.#fuelTypes()].sort((a, b) => a.description.localeCompare(b.description)));

  getVehiclesResource(filter?: FilterInput<VehiclesFilter>) {
    return this.#api.vehiclesResource(toFilterSignal(filter));
  }

  getVehicle(id: string): Promise<TransportationVehicle> {
    return this.#api.getOne(id);
  }

  getVehicleResource(id: Signal<string>) {
    return this.#api.vehicleResource(id);
  }

  create(vehicle: TransportationVehicleCreate) {
    return this.#api.createOne(vehicle);
  }

  update(id: string, update: TransportationVehicleUpdate) {
    return this.#api.updateOne(id, update);
  }

  delete(id: string) {
    return this.#api.deleteOne(id);
  }

  async validate<K extends Parameters<TransportationVehicleApiService['validate']>[1]>(
    path: SchemaPath<TransportationVehicle[K]>,
    field: K,
    initialValue: Signal<TransportationVehicle>,
  ) {
    applyWhen(
      path,
      ({ value }) => !!value() && value() !== initialValue()[field],
      (p) => this.#api.validate(p as SchemaPath<TransportationVehicle[K]>, field),
    );
  }

  newTransportationVehicle(): TransportationVehicle {
    return {
      _id: '',
      name: '',
      licencePlate: '',
      consumption: 0,
      fuelType: {
        type: '',
        description: '',
        units: '',
      },
      disabled: false,
      vin: '',
      odometerReadings: [],
    };
  }
}
