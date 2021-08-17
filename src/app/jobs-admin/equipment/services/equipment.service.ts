import { Injectable } from '@angular/core';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { Equipment, EquipmentPartial } from 'src/app/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';

interface EquipmentFilter {
  name?: string;
}

@Injectable({
  providedIn: 'any'
})
export class EquipmentService {

  private _filter = new BehaviorSubject<EquipmentFilter | null>(null);

  equipment$: Observable<EquipmentPartial[]> = this._filter.pipe(
    switchMap(filter => this.api.equipment.get<EquipmentPartial>(filter)),
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

  insertOne(equipment: Equipment): Observable<string> {
    return (this.api.equipment.insertOne(equipment) as Observable<string>).pipe(
      tap(_ => this.reload()),
    );
  }

  updateOne(equipment: Equipment): Observable<boolean> {
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
