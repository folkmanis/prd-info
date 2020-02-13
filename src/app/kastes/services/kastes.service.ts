import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, EMPTY, Subscription } from 'rxjs';
import { catchError, map, switchMap, tap, filter, take, distinctUntilChanged, multicast, share } from 'rxjs/operators';

import { KastesHttpService } from './kastes-http.service';
import { KastesPreferencesService } from './kastes-preferences.service';
import { Veikals } from './veikals';
import { Kaste } from './kaste.class';

@Injectable({
  providedIn: 'root'
})
export class KastesService {

  constructor(
    private kastesHttpService: KastesHttpService,
    private kastesPreferencesService: KastesPreferencesService,
  ) { }

  private totals = { loaded: false, loading: false };
  private _apjoms = 0;
  private totals$: BehaviorSubject<number[]> = new BehaviorSubject(new Array<number>());
  private kastes$: BehaviorSubject<Kaste[]> = new BehaviorSubject([]);

  private kastesSubs: Subscription;

  set apjoms(apj: number) {
    this._apjoms = apj;
    this.reloadKastes();
  }
  get apjoms(): number {
    return this._apjoms;
  }

  getTotals(): Observable<number[]> {
    if (!this.totals.loaded && !this.totals.loading) {
      this.totals.loading = true;
      this.kastesPreferencesService.preferences.pipe(
        filter(pref => !!pref.pasutijums && pref.pasutijums.length > 0),
        map(pref => pref.pasutijums),
        switchMap(pasutijums => this.kastesHttpService.getKastesHttp<{ total: number; }[]>('totals', { pasutijums })),
        map(t => t.map((val) => val.total)),
      ).subscribe(t => {
        this.totals$.next(t);
        this.totals.loaded = true;
        this.totals.loading = false;
      });
    }
    return this.totals$;
  }

  get kastes(): BehaviorSubject<Kaste[]> {
    return this.kastes$;
  }

  reloadKastes(): void {
    this.kastesSubs && this.kastesSubs.unsubscribe();
    this.kastesSubs = this.kastesPreferencesService.preferences.pipe(
      filter(pref => !!pref.pasutijums && pref.pasutijums.length > 0),
      map(pref => pref.pasutijums),
      switchMap(pasutijums => this.kastesHttpService.getKastesHttp<Kaste[]>('kastes', { pasutijums, apjoms: this._apjoms })),
    ).subscribe(k => {
      this.kastes$.next(k);
    });
  }

  reloadKaste(row: Kaste): void {
    const idx = this.kastes$.value.indexOf(row);
    this.kastesHttpService.getKasteHttp({ id: row._id, kaste: row.kaste })
      .subscribe(kaste => {
        const k = this.kastes$.value;
        k[idx] = kaste;
        this.kastes$.next(k);
      });
  }

  setGatavs(body: { field: string, id: string, kaste: number, yesno: boolean; }): Observable<{ changedRows: number; }> {
    return this.kastesHttpService.setGatavsHttp(body);
  }

  uploadTable(table: Veikals[]): Observable<{ affectedRows: number; }> {
    return this.kastesHttpService.uploadTableHttp(table);
  }

}
