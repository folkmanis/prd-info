import { EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { map, tap, switchMap, filter } from 'rxjs/operators';
import { Observable, merge, of, BehaviorSubject, Subscriber, Subscription, Subject } from 'rxjs';

import { KastesService } from '../services/kastes.service';
import { Kaste } from "../services/kaste.class";

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
  colorsRemain: BehaviorSubject<ColorsPakas> =
    new BehaviorSubject<ColorsPakas>({
      yellow: 0, rose: 0, white: 0,
    });

  private data$: BehaviorSubject<Kaste[]>;// = new BehaviorSubject<Kaste[]>([]);
  private eventSubscr: Subscription;

  constructor(
    private kastesService: KastesService,
    private rowChanged: EventEmitter<Kaste>,
    private totals$: Subject<{
      total: number,
      kastesRemain: number,
      labelsRemain: number,
    }>
  ) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Kaste[]> {

    this.kastesService.reloadKastes();
    this.eventSubscr = this.rowChanged.pipe(
      tap(rw => this.kastesService.reloadKaste(rw)),
      // tap(() => this.loaded.next(true)),
    ).subscribe();

    this.data$ = this.kastesService.kastes;

    return this.data$.pipe(
      tap(dat => {
        this.totals$.next({
          total: dat.length,
          kastesRemain: dat.reduce((total, curr) => total += curr.kastes.gatavs ? 0 : 1, 0),
          labelsRemain: dat.reduce((total, curr) => total += curr.kastes.uzlime ? 0 : 1, 0),
        });
        this.calcColorsRemain(dat);
      })
    );
  }
  /**
 *  Called when the table is being destroyed. Use this function, to clean up
 * any open connections or free any held resources that were set up during connect.
 */
  disconnect() {
    this.eventSubscr.unsubscribe();
  }
  /**
   * Aprēķina atlikušo vajadzīgo paciņu daudzumu pa krāsām
   * publicē colorsRemain objektā
   */
  private calcColorsRemain(dat: Kaste[]) {
    this.colorsRemain.next(
      dat.reduce((total, curr) => {
        curr.kastes.gatavs || Object.keys(total).forEach(key => total[key] += curr.kastes[key]);
        return total;
      }, { yellow: 0, rose: 0, white: 0 })
    );
  }

  /**
   * Uzliek gatavības iezīmi ierakstam.
   * @param id ieraksta id numurs
   * @param yesno false - noņem gatavības iezīmi, true - uzliek gatavibas iezīmi
   */
  setGatavs(id: string, kaste: number, yesno: boolean): Observable<boolean> {
    const rw = this.data$.value.find(val => val._id === id && val.kaste === kaste);
    if (!rw) { return of(false); }
    return this.kastesService.setGatavs({ field: 'gatavs', id, kaste, yesno }).pipe(
      map(({ changedRows }) => !!changedRows),
      filter(ok => ok),
      tap(() => {
        // this.kastesRemain += (yesno ? -1 : +1);
        // this.data$.value[idx].kastes.gatavs = yesno;
        this.rowChanged.emit(rw);
        // this.calcColorsRemain();
      })
    );
  }
  /**
   * Izmaina 'label' parametru datubāzē un tabulā
   * @param kods Veikala kods
   */
  setLabel(kods: number): Observable<Kaste | null> {
    const rw = this.data$.value.find(k => k.kods === kods && !k.kastes.uzlime);
    if (!rw) { return of(null); }
    // const rw = this.data$.value[idx];
    return this.kastesService.setGatavs({ field: 'uzlime', id: rw._id, kaste: rw.kaste, yesno: true })
      .pipe(
        filter(resp => !!resp.changedRows),
        map(() => {
          // this.labelsRemain--;
          rw.kastes.uzlime = true;
          this.rowChanged.emit(rw);
          return rw;
        })
      );
  }

}
