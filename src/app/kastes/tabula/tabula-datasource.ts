import { EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { map, tap, switchMap, filter } from 'rxjs/operators';
import { Observable, merge, of, BehaviorSubject } from 'rxjs';

import { KastesService, Kaste } from '../services/kastes.service';

export interface ColorsPakas {
  yellow: number,
  rose: number,
  white: number,
}

/**
 * Data source for the Tabula view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TabulaDataSource extends DataSource<Kaste> {
  data: Kaste[];
  total: number;
  kastesRemain: number;
  labelsRemain: number;
  colorsRemain: BehaviorSubject<ColorsPakas> =
    new BehaviorSubject<ColorsPakas>({
      yellow: 0, rose: 0, white: 0,
    });

  constructor(
    private kastesService: KastesService,
    private apjomsChanged: EventEmitter<number>,
    private rowChanged: EventEmitter<number>,
    private apjoms: number,
    private loaded: BehaviorSubject<boolean>,
  ) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Kaste[]> {
    return merge(
      this.getServerData(),
      this.apjomsChanged.pipe(tap((apj) => {
        { this.apjoms = apj; }
      }), switchMap(() => this.getServerData())),
      this.rowChanged
    ).pipe(
      map(() => this.data),
      tap(() => this.loaded.next(true)));
  }

  private getServerData(): Observable<Kaste[]> {
    return this.kastesService.getKastes(this.apjoms)
      .pipe(
        tap((dat) => {
          this.data = dat;
          this.total = dat.length;
          this.kastesRemain = dat.reduce((total, curr) => total += curr.kastes.gatavs ? 0 : 1, 0);
          this.labelsRemain = dat.reduce((total, curr) => total += curr.kastes.uzlime ? 0 : 1, 0);
          this.calcColorsRemain();
        })
      );
  }
  /**
   * Aprēķina atlikušo vajadzīgo paciņu daudzumu pa krāsām
   * publicē colorsRemain objektā
   */
  private calcColorsRemain() {
    this.colorsRemain.next(
      this.data.reduce((total, curr) => {
        curr.kastes.gatavs || Object.keys(total).forEach(key => total[key] += curr.kastes[key]);
        return total;
      }, { yellow: 0, rose: 0, white: 0 })
    );
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }

  /**
   * Uzliek gatavības iezīmi ierakstam.
   * @param id ieraksta id numurs
   * @param yesno false - noņem gatavības iezīmi, true - uzliek gatavibas iezīmi
   */
  setGatavs(id: string, kaste: number, yesno: boolean): Observable<boolean> {
    const idx = this.data.findIndex((val: Kaste) => val._id === id && val.kaste === kaste);
    return this.kastesService.setGatavs({ field: 'gatavs', id, kaste, yesno }).pipe(
      map(({ changedRows }) => !!changedRows),
      filter(ok => ok),
      tap(() => {
        this.kastesRemain += (yesno ? -1 : +1);
        this.data[idx].kastes.gatavs = yesno;
        this.rowChanged.emit(idx);
        this.calcColorsRemain();
      })
    );
  }
  /**
   * Izmaina 'label' parametru datubāzē un tabulā
   * @param kods Veikala kods
   */
  setLabel(kods: number): Observable<Kaste | null> {
    const idx = this.data.findIndex(k => k.kods === kods && !k.kastes.uzlime);
    if (idx === -1) { return of(null); }
    return this.kastesService.setGatavs({ field: 'uzlime', id: this.data[idx]._id, kaste: this.data[idx].kaste, yesno: true })
      .pipe(
        filter(resp => !!resp.changedRows),
        map(() => {
          this.labelsRemain--;
          this.data[idx].kastes.uzlime = true;
          this.rowChanged.emit(idx);
          return this.data[idx];
        })
      );
  }

}
