import { inject, Injectable, signal } from '@angular/core';
import { TransportationDriverApiService } from './transportation-driver-api.service';
import { TransportationDriver } from '../interfaces/transportation-driver';

@Injectable({
  providedIn: 'root',
})
export class TransportationDriverService {
  private api = inject(TransportationDriverApiService);
  #drivers = signal<TransportationDriver[]>([]);

  drivers = this.#drivers.asReadonly();

  constructor() {
    this.retrieveAll();
  }

  async getDriver(id: string) {
    return this.api.getOne(id);
  }

  async create(driver: Omit<TransportationDriver, 'id'>) {
    const result = await this.api.createOne(driver);
    this.retrieveAll();
    return result;
  }

  async update(driver: Pick<TransportationDriver, 'id'> & Partial<TransportationDriver>) {
    const { id, ...rest } = driver;
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

  private async retrieveAll() {
    const drivers = await this.api.getAll();
    this.#drivers.set(drivers);
  }
}
