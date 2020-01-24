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

  getTotals(): Observable<number[]> {
    return this.makeReq<{ total: number; }[]>('totals').pipe(
      map((totals) => totals.map((val) => val.total))
    );
  }

  getKastes(apjoms: number): Observable<Kaste[]> {
    return this.makeReq<Kaste[]>(`kastes`, { apjoms });
  }

  setGatavs(body:{field:string, id: string, kaste: number, yesno: boolean}): Observable<{ changedRows: number; }> {
    return this.kastesHttpService.setGatavsHttp(body);
  }
  
  private makeReq<T>(path: string, opt?: { [key: string]: any; }): Observable<T> {
    return this.kastesPreferencesService.preferences.pipe(
      switchMap(pref => this.kastesHttpService.getKastesHttp<T>(path, { pasutijums: pref.pasutijums, ...opt })
      )
    );
  }
}
