import { computed, inject, Injectable, signal } from '@angular/core';
import { configuration } from 'src/app/services/config.provider';
import { TransportationVehicle } from '../interfaces/transportation-vehicle';
import { TransportationVehicleApiService } from './transportation-vehicle-api.service';

@Injectable({
  providedIn: 'root',
})
export class TransportationVehicleService {
  private api = inject(TransportationVehicleApiService);

  #fuelTypes = configuration('transportation', 'fuelTypes');
  #vehicles = signal<TransportationVehicle[]>([]);

  vehicles = this.#vehicles.asReadonly();
  vehiclesActive = computed(() => this.#vehicles().filter((v) => !v.disabled));
  fuelTypes = computed(() => [...this.#fuelTypes()].sort((a, b) => a.description.localeCompare(b.description)));

  constructor() {
    this.retrieveAll();
  }

  async getVehicle(id: string): Promise<TransportationVehicle> {
    return this.api.getOne(id);
  }

  async create(vehicle: Omit<TransportationVehicle, 'id'>) {
    const result = await this.api.createOne(vehicle);
    this.retrieveAll();
    return result;
  }

  async update(vehicle: Pick<TransportationVehicle, '_id'> & Partial<TransportationVehicle>) {
    const { _id: id, ...rest } = vehicle;
    const result = await this.api.updateOne(id, rest);
    this.retrieveAll();
    return result;
  }

  async delete(id: string) {
    const result = await this.api.deleteOne(id);
    if (result > 0) {
      this.retrieveAll();
    }
    return result;
  }

  async validateName(name: string): Promise<boolean> {
    const names = await this.api.validate('name');
    return names.every((n) => n.toUpperCase() !== name.toUpperCase());
  }

  async validateLicencePlate(plate: string): Promise<boolean> {
    const plates = await this.api.validate('licencePlate');
    return plates.every((p) => p !== plate);
  }

  private async retrieveAll() {
    const vehicles = await this.api.getAll();
    this.#vehicles.set(vehicles);
  }
}
