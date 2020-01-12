import { EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { map, tap, startWith, switchMap } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

import { KastesService, Kaste } from '../services/kastes.service';

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

  constructor(
    private kastesService: KastesService,
    private apjomsChanged: EventEmitter<number>,
    private rowChanged: EventEmitter<number>,
    private apjoms: number,
    private loaded: EventEmitter<boolean>,
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
      tap(() => this.loaded.emit(true)));
  }

  private getServerData(): Observable<Kaste[]> {
    return this.kastesService.getKastes(this.apjoms)
      .pipe(
        tap((dat) => {
          this.data = dat;
          this.total = dat.length;
          this.kastesRemain = dat.reduce((total, curr) => total += curr.gatavs ? 0 : 1, 0);
          this.labelsRemain = dat.reduce((total, curr) => total += curr.label ? 0 : 1, 0);
        })
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
   * @param act 0 - noņem gatavības iezīmi, 1 - uzliek gatavibas iezīmi
   */
  setGatavs(id: number, act: number) {
    const idx = this.data.findIndex((val: Kaste) => val.id === id);
    this.kastesService.setGatavs(id, act).subscribe(atbilde => {
      if (atbilde.changedRows === 1) {
        this.kastesRemain += (act ? -1 : +1);
        this.data[idx].gatavs = act;
        this.rowChanged.emit(idx);
      }
    });
  }
  /**
   * Izmaina 'label' parametru datubāzē un tabulā
   * @param kods Veikala kods
   */
  setLabel(kods: number): Observable<Kaste | null> {
    return this.kastesService.setLabel(kods, 1)
      .pipe(
        map((resp) => {
          if (resp.length) {
            const idx = this.data.findIndex((val: Kaste) => val.id === resp[0].id);
            this.labelsRemain--;
            this.data[idx].label = 1;
            this.rowChanged.emit(idx);
            return resp[0];
          } else {
            return null;
          }
        })
      );
  }

}
