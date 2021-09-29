import { Injectable } from '@angular/core';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { Equipment, EquipmentPartial } from 'src/app/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, shareReplay, switchMap, tap } from 'rxjs/operators';

interface EquipmentFilter {
  name?: string;
}

@Injectable({
  providedIn: 'any'
})
export class EquipmentService {

  private _filter = new BehaviorSubject<EquipmentFilter | null>(null);

  equipment$: Observable<EquipmentPartial[]> = this._filter.pipe(
    distinctUntilChanged(),
    switchMap(filter => this.api.equipment.get<EquipmentPartial>(filter)),
    shareReplay(1),
  );

  constructor(
    private api: PrdApiService,
  ) { }

  reload() {
    this._filter.next(this._filter.value);
  }

  setFilter(filter: EquipmentFilter | null) {
    this._filter.next(filter);
  }

  getList(): Observable<EquipmentPartial[]> {
    return this.api.equipment.get();
  }

  getOne(id: string): Observable<Equipment> {
    return this.api.equipment.get(id);
  }

  insertOne(equipment: Equipment): Observable<Equipment> {
    return this.api.equipment.insertOne(equipment).pipe(
      tap(_ => this.reload()),
    );
  }

  updateOne(equipment: Equipment): Observable<Equipment> {
    const { _id, ...update } = equipment;
    return this.api.equipment.updateOne(_id, update).pipe(
      tap(_ => this.reload()),
    );
  }

  names(): Observable<string[]> {
    return this.api.equipment.validatorData('name').pipe(
      tap(_ => this.reload()),
    );
  }

}
