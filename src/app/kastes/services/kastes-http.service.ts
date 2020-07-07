import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, zip } from 'rxjs';
import { HttpOptions } from '../../library/http/http-options';
import { Pasutijums } from '../interfaces';
import { Kaste, Veikals, KastesUserPreferences } from '../interfaces';
import { tap, switchMap, map } from 'rxjs/operators';

export interface CleanupResponse { deleted: { pasutijumi: number, veikali: number, }; }

interface TotalsKastes {
  totals: { total: number; }[];
  kastes: Kaste[];
}

@Injectable({
  providedIn: 'root'
})
export class KastesHttpService {
  private httpPathKastes = '/data/kastes/';

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Saņem pasūtījumu sarakstu no servera
   * @param path Relatīvais ceļš
   * Atgriež Observable masīvu no Pasūtījumu objekta
   */
  getPasutijumiHttp(): Observable<Pasutijums[]> {
    return this.http.get<Pasutijums[]>(this.httpPathKastes + 'pasnames', new HttpOptions());
  }
  addPasutijumsHttp(name: string): Observable<{ _id: string; }> {
    return this.http.post<{ _id: string; }>(this.httpPathKastes + 'addpasutijums', { pasutijums: name }, new HttpOptions());
  }
  updatePasutijums(pas: Partial<Pasutijums>): Observable<{ changedRows: number; }> {
    return this.http.post<{ changedRows: number; }>(this.httpPathKastes + 'updatepasutijums', { pasutijums: pas }, new HttpOptions());
  }

  getPreferencesHttp(): Observable<KastesUserPreferences> {
    return this.getUserPreferencesHttp();
    // return zip(this.getSystemPreferencesHttp(), this.getUserPreferencesHttp()).pipe(
    //   map(([sys, usr]) => ({ ...sys, ...usr })),
    // );
  }
  getUserPreferencesHttp(): Observable<KastesUserPreferences> {
    return this.http.get<KastesUserPreferences>(this.httpPathKastes + 'preferences', new HttpOptions());
  }
  /**
   * Iestata jaunas lietotāja preferences kastes modulim
   * Atgriež boolean par pieprasījuma izpildi
   * @param preferences Preferences objekts ar jaunajām preferencēm
   * @param path Relatīvais ceļš
   */
  setUserPreferencesHttp(preferences: Partial<KastesUserPreferences>): Observable<boolean> {
    return this.http.post<boolean>(this.httpPathKastes + 'preferences', { preferences }, new HttpOptions());
  }
  /**
   * Izdzēš neaktīvos pasūtījumus no pasūtījumu un pakošanas bāzēm
   */
  pasutijumiCleanup(): Observable<CleanupResponse> {
    return this.http.delete<CleanupResponse>(this.httpPathKastes + 'pasutijums-cleanup', new HttpOptions());
  }

  uploadTableHttp(veikali: Veikals[]): Observable<{ affectedRows: number; }> {
    return this.http.post<{ affectedRows: number; }>(this.httpPathKastes + 'table', { veikali }, new HttpOptions());

  }

}
