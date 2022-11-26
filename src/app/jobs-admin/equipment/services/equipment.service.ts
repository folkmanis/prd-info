import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Equipment, EquipmentPartial } from 'src/app/interfaces';
import { EquipmentApiService } from 'src/app/services/prd-api/equipment-api.service';

export interface EquipmentFilter {
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {



  constructor(
    private api: EquipmentApiService,
  ) { }


  getList(filter: EquipmentFilter = {}): Observable<EquipmentPartial[]> {
    return this.api.getAll(filter);
  }

  getOne(id: string): Observable<Equipment> {
    return this.api.getOne(id);
  }

  insertOne(equipment: Omit<Equipment, '_id'>): Observable<Equipment> {
    return this.api.insertOne(equipment);
  }

  updateOne(equipment: Pick<Equipment, '_id'> & Partial<Equipment>): Observable<Equipment> {
    const { _id, ...update } = equipment;
    return this.api.updateOne(_id, update);
  }

  names(): Observable<string[]> {
    return this.api.validatorData('name');
  }

}
