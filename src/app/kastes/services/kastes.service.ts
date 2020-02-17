/**
 * Uztur sarakstu ar pakošanas sarakstu
 * 
 * Piedāvā:
 * kastes$ - multicast observable uz kastēm
 * totals$ - kopējie skaiti
 * volumes$ - apjomi [1,2,3,4,5...]
 * loading$ - ielādes process aktīvs
 * 
 * Klausās:
 * preferences.pasutijums - pārlādē visu pie pasūtījuma maiņas
 *     reaģē uz krāsu izmaiņām
 * apjoms$ - apjoma filtrs. kastes$ un totals$ reaģē uz apjoma filtru
 *    sākotnējā vērtība - "0" - nav filtre
 * 
 * Funkcijas:
 * setGatavs - izmaina statusu gatavības laukam vienam ierakstam
 *    atjauno sarakstu uz servera, apstiprinājuma gadījumā izmaina vietējo sarakstu,
 *    izpilda kastes$.next jaunajam sarakstam
 *    atgriež Observable<boolean>
 */

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, EMPTY, Subscription, Subject, combineLatest } from 'rxjs';
import { catchError, map, switchMap, tap, filter, take, distinctUntilChanged, multicast, share, takeUntil } from 'rxjs/operators';

import { KastesHttpService } from './kastes-http.service';
import { KastesPreferencesService } from './kastes-preferences.service';
import { Kaste, Totals } from './kaste.class';
import { KastesPreferences } from './preferences';

@Injectable({
  providedIn: 'root'
})
export class KastesService {
  constructor(
    private kastesHttpService: KastesHttpService,
    private kastesPreferencesService: KastesPreferencesService,
  ) { }
  private _kastesAll$: BehaviorSubject<Kaste[]>; // Visas kastes, bez filtra
  private _subscr: Subscription[] = [];
  private _unSubscr: Subject<void> = new Subject();
  apjoms$: BehaviorSubject<number> = new BehaviorSubject(0);
  loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  volumes$: BehaviorSubject<number[]> = new BehaviorSubject([0]);
  /**
   * Pēc $apjoms filtrēts saraksts
   */
  get kastes$(): Observable<Kaste[]> {
    return combineLatest(this.kastesAll$, this.apjoms$).pipe(
      takeUntil(this._unSubscr),
      map(([kast, apj]) => apj ? kast.filter(val => val.kastes.total === apj) : kast),
      share(),
    );
  }

  get kastesAll$(): Observable<Kaste[]> {
    if (!this._kastesAll$) { this.connect(); }
    return this._kastesAll$;
  }

  private connect(): Subject<Kaste[]> {
    this._kastesAll$ = new BehaviorSubject([]);
    // Sākotnējo datu saņemšana
    const subscr = this.kastesPreferencesService.preferences.pipe(
      takeUntil(this._unSubscr),
      tap(() => this.loading$.next(true)),
      filter(pref => !!pref.pasutijums && pref.pasutijums.length > 0),
      map(pref => pref.pasutijums),
      switchMap(pasutijums => this.kastesHttpService.getTotalsKastesHttp(pasutijums))
    )
      .subscribe(totalsKastes => {
        this._kastesAll$.next(totalsKastes.kastes);
        this.volumes$.next(totalsKastes.totals.map(tot => tot.total));
        this.loading$.next(false);
      });
    this._subscr.push(subscr);
    return this._kastesAll$;
  }

  disconnect() {
    this._unSubscr.next();
    delete this._kastesAll$;
  }

  set apjoms(apj: number) {
    this.apjoms$.next(apj);
  }
  get apjoms(): number {
    return this.apjoms$.value;
  }

  readonly totals$ = combineLatest(this.kastes$, this.kastesPreferencesService.preferences).pipe(
    takeUntil(this._unSubscr),
    map(([kastes, pref]) => this.calcTotals(kastes, pref))
  );

  private calcTotals(kastes: Kaste[], pref: KastesPreferences): Totals {
    const tot: Totals = {
      total: kastes.length,
      kastesRemain: kastes.reduce((total, curr) => total += curr.kastes.gatavs ? 0 : 1, 0),
      labelsRemain: kastes.reduce((total, curr) => total += curr.kastes.uzlime ? 0 : 1, 0),
      colorMap: new Map<string, { total: number, style: { color: string; }; }>(),
    };
    const colorsPakas =
      kastes.reduce((total, curr) => {
        curr.kastes.gatavs || Object.keys(total).forEach(key => total[key] += curr.kastes[key]);
        return total;
      }, { yellow: 0, rose: 0, white: 0 });
    for (const key of Object.keys(colorsPakas)) {
      tot.colorMap.set(key, { total: colorsPakas[key], style: { color: pref.colors[key] } });
    };
    return tot;
  }
  /**
   * Uzliek vai noņem gatavības iezīmi laukam. Pēc apstiprinošas servera atbildes
   * izmaina vērtību lokālajā masīvā _kastesAll$
   * @param rw rinda no Kastes[]
   * @param field lauks 'gatavs'vai 'uzlime'
   * @param yesno vērtība, uz kuru jānomaina
   */
  setGatavs(rw: Kaste, field: 'gatavs' | 'uzlime', yesno: boolean): Observable<Kaste | null> {
    if (!this._kastesAll$) { return of(null); } // katram gadījumam
    return this.kastesHttpService.setGatavsHttp({ id: rw._id, kaste: rw.kaste, field, yesno }).pipe(
      switchMap(resp => (resp.changedRows > 0) ? this.updateKaste(rw, field, yesno) : of(null))
    );
  }

  private updateKaste(rw: Kaste, field: 'gatavs' | 'uzlime', yesno: boolean): Observable<Kaste> {
    rw.kastes[field] = yesno;
    this._kastesAll$.next(this._kastesAll$.value);
    return of(rw);
  }

}
