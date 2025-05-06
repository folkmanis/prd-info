import { computed, inject, Injectable } from '@angular/core';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { configuration } from 'src/app/services/config.provider';
import { TransportationVehicle, TransportationVehicleCreate, TransportationVehicleUpdate } from '../interfaces/transportation-vehicle';
import { TransportationVehicleApiService } from './transportation-vehicle-api.service';

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

  getVehiclesResource(filter: FilterInput<VehiclesFilter>) {
    return this.#api.vehiclesResource(toFilterSignal(filter));
  }

  getVehicle(id: string): Promise<TransportationVehicle> {
    return this.#api.getOne(id);
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

  async validateName(name: string): Promise<boolean> {
    const names = await this.#api.validate('name');
    return names.every((n) => n.toUpperCase() !== name.toUpperCase());
  }

  async validateLicencePlate(plate: string): Promise<boolean> {
    const plates = await this.#api.validate('licencePlate');
    return plates.every((p) => p !== plate);
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
    };
  }
}
