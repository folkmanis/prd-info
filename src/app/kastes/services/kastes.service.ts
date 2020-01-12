import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { PreferencesService } from './preferences.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import { HttpService } from './http.service';

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
    private prefsService: PreferencesService,
    private httpService: HttpService,
  ) { }

  getTotals(): Observable<number[]> {
    return this.makeReq<{total: number}>('totals?').pipe(
      map((totals) => totals.map((val) => val.total))
      );
  }

  getKastes(apjoms: number): Observable<Kaste[]> {
    return this.makeReq<Kaste>(`numbers?kastes=${apjoms}`);
  }

  /**
   * Saņem no servera vienas kastes ierakstu
   * @param id ieraksta numurs
   */
  getKaste(id: number): Observable<Kaste> {
    return this.makeReq<Kaste>(`numbers?id=${id}`).pipe(map((res) => res[0]));
  }
  setGatavs(id: number, yesno: number): Observable<{ changedRows: number }> {
    // const path = `gatavs/${yesno}?id=${id}`;
    return this.httpService.setGatavsHttp({id, yesno});
  }
  // /data/label/:yesno?nr=XXX
  setLabel(nr: number, yesno: number): Observable<Kaste[]> {
    return this.makeReq<Kaste>(`label/${yesno}?nr=${nr}`);
  }

  private makeReq<T>(path: string): Observable<T[]> {
    return this.prefsService.getPreferences().pipe(
      switchMap((p) => {
        path = path + '&pasutijums=' + p.pasutijums;
        return this.httpService.getKastesHttp<T>(path);
      })
    );
  }
}
