import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

export const TABLE_COLUMNS = [
  'kods', 'adrese', 'yellow', 'rose', 'white'
] as const;

export type ColumnNames = typeof TABLE_COLUMNS[number];

interface ChipsSet {
  avail: Set<ColumnNames>; // Vajadzīgo sleju nosaukumi
  assign: Map<string, ColumnNames>; // [sleja, čips]
}


@Injectable({
  providedIn: 'any'
})
export class ChipsService {

  private _available: Set<ColumnNames>;
  private _assignement: Map<string, ColumnNames>;

  private _chips$ = new ReplaySubject<ChipsSet>(1);
  chips$ = this._chips$.pipe(
    map(({ avail, assign }) => ({
      available: Array.from(avail),
      assignement: Array.from(assign),
    })),
    shareReplay(1),
  );

  constructor() {
  }

  resetChips() {
    this.initChips();
    this.submitChips();
  }

  removeChip(column: string) {
    this._available.add(this._assignement.get(column));
    this._assignement.delete(column);
    this.submitChips();
  }

  moveChip(chipName: ColumnNames, destCol: string) {
    const [currCol] = [...this._assignement.entries()].find(([, chip]) => chip === chipName) || [];
    if (currCol) {
      this._assignement.delete(currCol);
    } else {
      this._available.delete(chipName);
    }
    // ja mērķa sleja jau aizņemta, noņem
    if (this._assignement.has(destCol)) {
      this._available.add(this._assignement.get(destCol));
      this._assignement.delete(destCol);
    }

    this._assignement.set(destCol, chipName);
    this.submitChips();
  }

  private initChips() {
    this._available = new Set(TABLE_COLUMNS);
    this._assignement = new Map();
  }

  private submitChips() {
    this._chips$.next({ avail: this._available, assign: this._assignement });
  }

}
