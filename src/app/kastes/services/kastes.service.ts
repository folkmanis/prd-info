import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { KastesHttpService } from './kastes-http.service';
import { PasutijumiService } from './pasutijumi.service';
import { KastesPreferencesService } from './kastes-preferences.service';
import { Pasutijums } from './pasutijums';
import { KastesPreferences } from './preferences';
import { Veikals } from './veikals';

export class Kaste {
  id?: number;
  Nr: number;
  kods: number;
  adrese: string;
  yellow: number;
  rose: number;
  white: number;
  gatavs: number;
  total?: number;
  label: number;
  pasutijums?: number;
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

  getTotals(): Observable<number[]> {
    return this.makeReq<{ total: number; }>('totals').pipe(
      map((totals) => totals.map((val) => val.total))
    );
  }

  getKastes(apjoms: number): Observable<Kaste[]> {
    return this.makeReq<Kaste>(`kastes`, { apjoms });
  }

  /**
   * Saņem no servera vienas kastes ierakstu
   * @param id ieraksta numurs
   */
  getKaste(id: number): Observable<Kaste> {
    return this.makeReq<Kaste>(`numbers?id=${id}`).pipe(map((res) => res[0]));
  }
  setGatavs(id: number, yesno: number): Observable<{ changedRows: number; }> {
    // const path = `gatavs/${yesno}?id=${id}`;
    return this.kastesHttpService.setGatavsHttp({ id, yesno });
  }
  // /data/label/:yesno?nr=XXX
  setLabel(nr: number, yesno: number): Observable<Kaste[]> {
    return this.makeReq<Kaste>(`label/${yesno}?nr=${nr}`);
  }

  private makeReq<T>(path: string, opt?: { [key: string]: any; }): Observable<T[]> {
    return this.kastesPreferencesService.preferences.pipe(
      switchMap(pref => this.kastesHttpService.getKastesHttp<T>(path, { pasutijums: pref.pasutijums, ...opt })
      )
    );
  }
}
