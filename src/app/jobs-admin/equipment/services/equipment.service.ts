import { inject, ResourceRef, Service } from '@angular/core';
import { SchemaPath } from '@angular/forms/signals';
import { Equipment, EquipmentCreate, EquipmentList, EquipmentUpdate } from 'src/app/interfaces';
import { FilterInput, toFilterSignal } from 'src/app/library';
import { EquipmentApiService } from 'src/app/services/prd-api/equipment-api.service';
import { EquipmentFilter } from './equipment-filter.schema';

@Service()
export class EquipmentService {
  #api = inject(EquipmentApiService);

  getEquipmentResource(filter?: FilterInput<EquipmentFilter>): ResourceRef<EquipmentList[] | undefined> {
    return this.#api.equipmentResource(toFilterSignal(filter));
  }

  getOne(id: string): Promise<Equipment> {
    return this.#api.getOne(id);
  }

  insertOne(equipment: EquipmentCreate): Promise<Equipment> {
    return this.#api.insertOne(equipment);
  }

  updateOne(id: string, update: EquipmentUpdate): Promise<Equipment> {
    return this.#api.updateOne(id, update);
  }

  delete(id: string): Promise<number> {
    return this.#api.deleteOne(id);
  }

  newEquipment(): Equipment {
    return {
      _id: '',
      name: '',
      disabled: false,
    };
  }

  isNameAvailable(schema: SchemaPath<string>) {
    this.#api.validate(schema, 'name');
  }
}
