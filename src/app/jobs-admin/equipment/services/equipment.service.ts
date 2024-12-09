import { inject, Injectable, resource, signal } from '@angular/core';
import { isEqual } from 'lodash-es';
import { Equipment } from 'src/app/interfaces';
import { EquipmentApiService } from 'src/app/services/prd-api/equipment-api.service';

export interface EquipmentFilter {
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EquipmentService {
  private api = inject(EquipmentApiService);

  filter = signal<EquipmentFilter>({});

  equipment = resource({
    request: () => ({ filter: this.filter() }),
    loader: ({ request }) => this.api.getAll(request.filter),
    equal: isEqual,
  });

  async getOne(id: string): Promise<Equipment> {
    return this.api.getOne(id);
  }

  async insertOne(equipment: Omit<Equipment, '_id'>): Promise<Equipment> {
    return this.runWithReload(() => this.api.insertOne(equipment));
  }

  async updateOne(equipmentUpdate: Pick<Equipment, '_id'> & Partial<Equipment>): Promise<Equipment> {
    const { _id, ...update } = equipmentUpdate;
    return this.runWithReload(() => this.api.updateOne(_id, update));
  }

  async delete(id: string): Promise<number> {
    return this.runWithReload(() => this.api.deleteOne(id));
  }

  async validateName(value: string): Promise<boolean> {
    const names = await this.api.validatorData('name');
    return names.map((name) => name.toUpperCase()).includes(value) === false;
  }

  private async runWithReload<T>(reqFn: () => Promise<T>): Promise<T> {
    const resp = await reqFn();
    this.equipment.reload();
    return resp;
  }
}
