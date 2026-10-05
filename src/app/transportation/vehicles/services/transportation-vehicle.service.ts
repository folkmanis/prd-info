import { computed, inject, Service, Signal } from '@angular/core';
import { SchemaPath } from '@angular/forms/signals';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { configuration } from 'src/app/services/config.provider';
import { Vehicle, VehicleCreate, VehicleUpdate } from '../schemas/transportation-vehicle';
import { VehiclesQuery } from '../schemas/vehicles-query.schema';
import { VehicleEdit } from '../transportation-vehicle-edit/vehicle-edit.model';
import { TransportationVehicleApiService } from './transportation-vehicle-api.service';

@Service()
export class TransportationVehicleService {
  #api = inject(TransportationVehicleApiService);

  #fuelTypes = configuration('transportation', 'fuelTypes');
  fuelTypes = computed(() => [...this.#fuelTypes()].sort((a, b) => a.description.localeCompare(b.description)));

  getVehiclesResource(filter?: FilterInput<VehiclesQuery>) {
    return this.#api.vehiclesResource(toFilterSignal(filter));
  }

  getVehicle(id: string): Promise<Vehicle> {
    return this.#api.getOne(id);
  }

  getVehicleResource(id: Signal<string>) {
    return this.#api.vehicleResource(id);
  }

  create(vehicle: VehicleCreate) {
    return this.#api.createOne(vehicle);
  }

  update(id: string, update: VehicleUpdate) {
    return this.#api.updateOne(id, update);
  }

  delete(id: string) {
    return this.#api.deleteOne(id);
  }

  async validate<K extends Parameters<TransportationVehicleApiService['validate']>[1]>(
    path: SchemaPath<VehicleEdit[K]>,
    field: K,
  ) {
    this.#api.validate(path, field);
  }

  newTransportationVehicle(): Vehicle {
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
