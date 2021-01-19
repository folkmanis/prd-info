import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { TABLE_COLUMNS } from './upload-row';

interface Chips {
  available: string[]; // Vajadzīgo sleju nosaukumi
  assignement: [string, string][]; // [sleja, čips]
}

interface ChipsSet {
  avail: Set<string>; // Vajadzīgo sleju nosaukumi
  assign: Map<string, string>; // [sleja, čips]
}

const InitialChips: Chips = {
  available: TABLE_COLUMNS,
  assignement: [],
};

@Injectable({providedIn: 'any'})
export class ChipsService {

  private _available: Set<string>;
  private _assignement: Map<string, string>;

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

  moveChip(chipName: string, destCol: string) {
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
    this._assignement = new Map<string, string>();
  }

  private submitChips() {
    this._chips$.next({ avail: this._available, assign: this._assignement });
  }

}
