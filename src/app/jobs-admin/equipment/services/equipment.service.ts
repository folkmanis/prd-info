import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Equipment, EquipmentPartial } from 'src/app/interfaces';
import { EquipmentApiService } from 'src/app/services/prd-api/equipment-api.service';

interface EquipmentFilter {
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private _filter = new BehaviorSubject<EquipmentFilter>({});

  equipment$: Observable<EquipmentPartial[]> = this._filter.pipe(
    switchMap(filter => this.getList(filter)),
    shareReplay(1),
  );

  constructor(
    private api: EquipmentApiService,
  ) { }

  reload() {
    this._filter.next(this._filter.value);
  }

  setFilter(filter: EquipmentFilter = {}) {
    this._filter.next(filter);
  }

  getList(filter: EquipmentFilter = {}): Observable<EquipmentPartial[]> {
    return this.api.getAll(filter);
  }

  getOne(id: string): Observable<Equipment> {
    return this.api.getOne(id);
  }

  insertOne(equipment: Omit<Equipment, '_id'>): Observable<Equipment> {
    return this.api.insertOne(equipment).pipe(
      tap(_ => this.reload()),
    );
  }

  updateOne(equipment: Pick<Equipment, '_id'> & Partial<Equipment>): Observable<Equipment> {
    const { _id, ...update } = equipment;
    return this.api.updateOne(_id, update).pipe(
      tap(_ => this.reload()),
    );
  }

  names(): Observable<string[]> {
    return this.api.validatorData('name');
  }

}
