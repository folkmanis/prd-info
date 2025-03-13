import { inject, Injectable, signal, Signal } from '@angular/core';
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

  getEquipmentResource(filterSignal?: Signal<EquipmentFilter>) {
    return this.api.equipmentResource(filterSignal ?? signal({}));
  }

  getOne(id: string): Promise<Equipment> {
    return this.api.getOne(id);
  }

  insertOne(equipment: Omit<Equipment, '_id'>): Promise<Equipment> {
    return this.api.insertOne(equipment);
  }

  updateOne(equipmentUpdate: Pick<Equipment, '_id'> & Partial<Equipment>): Promise<Equipment> {
    const { _id, ...update } = equipmentUpdate;
    return this.api.updateOne(_id, update);
  }

  delete(id: string): Promise<number> {
    return this.api.deleteOne(id);
  }

  async validateName(value: string): Promise<boolean> {
    const names = await this.api.validatorData('name');
    return names.map((name) => name.toUpperCase()).includes(value) === false;
  }
}
