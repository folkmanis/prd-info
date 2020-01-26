import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, map, switchMap, tap, filter } from 'rxjs/operators';

import { KastesHttpService } from './kastes-http.service';
import { PasutijumiService } from './pasutijumi.service';
import { KastesPreferencesService } from './kastes-preferences.service';
import { Pasutijums } from './pasutijums';
import { KastesPreferences } from './preferences';
import { Veikals } from './veikals';

export class Kaste {
  _id: string;
  kods: number;
  adrese: string;
  pasutijums: string;
  kastes: {
    yellow: number;
    rose: number;
    white: number;
    gatavs: boolean;
    total?: number;
    uzlime: boolean;
  };
  kaste: number;
}

@Injectable({
  providedIn: 'root'
})
export class KastesService {

  constructor(
    private kastesHttpService: KastesHttpService,
    private pasutijumiService: PasutijumiService,
    private kastesPreferencesService: KastesPreferencesService,
  ) { }

  private totals = { loaded: false, loading: false };
  private totals$: BehaviorSubject<number[]> = new BehaviorSubject(new Array<number>());

  getTotals(): Observable<number[]> {
    if (!this.totals.loaded && !this.totals.loading) {
      this.totals.loading = true;
      this.kastesPreferencesService.preferences.pipe(
        filter(pref => !!pref.pasutijums && pref.pasutijums.length > 0),
        switchMap(pref => this.makeReq<{ total: number; }[]>('totals')),
        map(t => t.map((val) => val.total)),
      ).subscribe(t => {
        this.totals$.next(t);
        this.totals.loaded = true;
        this.totals.loading = false;
      });
    }
    return this.totals$;
  }

  getKastes(apjoms: number): Observable<Kaste[]> {
    return this.makeReq<Kaste[]>(`kastes`, { apjoms });
  }

  setGatavs(body: { field: string, id: string, kaste: number, yesno: boolean; }): Observable<{ changedRows: number; }> {
    return this.kastesHttpService.setGatavsHttp(body);
  }

  uploadTable(table: Veikals[]): Observable<{ affectedRows: number; }> {
    return this.kastesHttpService.uploadTableHttp(table);
  }

  private makeReq<T>(path: string, opt?: { [key: string]: any; }): Observable<T> {
    return this.kastesPreferencesService.preferences.pipe(
      filter(pref => !!pref.pasutijums),
      switchMap(pref => this.kastesHttpService.getKastesHttp<T>(path, { pasutijums: pref.pasutijums, ...opt })
      )
    );
  }
}
