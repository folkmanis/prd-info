import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, zip } from 'rxjs';
import { HttpOptions } from '../../library/http/http-options';
import { KastesPreferences, UserPreferences, SystemPreferences } from './preferences';
import { Pasutijums } from './pasutijums';
import { Veikals } from './veikals';
import { Kaste } from './kaste.class';
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

  getPreferencesHttp(): Observable<UserPreferences> {
    return this.getUserPreferencesHttp();
    // return zip(this.getSystemPreferencesHttp(), this.getUserPreferencesHttp()).pipe(
    //   map(([sys, usr]) => ({ ...sys, ...usr })),
    // );
  }
  getUserPreferencesHttp(): Observable<UserPreferences> {
    return this.http.get<UserPreferences>(this.httpPathKastes + 'preferences', new HttpOptions());
  }
  /**
   * Iestata jaunas lietotāja preferences kastes modulim
   * Atgriež boolean par pieprasījuma izpildi
   * @param preferences Preferences objekts ar jaunajām preferencēm
   * @param path Relatīvais ceļš
   */
  setUserPreferencesHttp(preferences: Partial<UserPreferences>): Observable<boolean> {
    return this.http.post<boolean>(this.httpPathKastes + 'preferences', { preferences }, new HttpOptions());
  }
  /**
   * Izdzēš neaktīvos pasūtījumus no pasūtījumu un pakošanas bāzēm
   */
  pasutijumiCleanup(): Observable<CleanupResponse> {
    return this.http.delete<CleanupResponse>(this.httpPathKastes + 'pasutijums-cleanup', new HttpOptions());
  }
  /**
   * Universālā GET funkcija
   * @param path pieprasījuma ceļš
   * @param opt parametri
   */
  getKastesHttp<T>(path: string, opt: { [key: string]: any; }): Observable<T> {
    return this.http.get<T>(this.httpPathKastes + path, new HttpOptions(opt));
  }
  /**
   *
   * @param pasutijums Pasūtījuma id
   */
  getTotalsKastesHttp(pasutijums: string): Observable<TotalsKastes> {
    return this.http.get<TotalsKastes>(this.httpPathKastes + 'totals-kastes', new HttpOptions({ pasutijums }));
  }
  /**
   * Atgriež vienas kastes ierakstu
   * @param path Relatīvais ceļš
   */
  getKasteHttp(params: { id: string, kaste: number; }): Observable<Kaste> {
    return this.http.get<Kaste>(this.httpPathKastes + 'kaste', new HttpOptions(params));
  }

  setGatavsHttp(body: { field: string, id: string, kaste: number, yesno: boolean; }): Observable<{ changedRows: number; }> {
    return this.http.post<{ changedRows: number; }>(this.httpPathKastes + 'gatavs', body, new HttpOptions());
  }

  uploadTableHttp(veikali: Veikals[]): Observable<{ affectedRows: number; }> {
    return this.http.post<{ affectedRows: number; }>(this.httpPathKastes + 'table', { veikali }, new HttpOptions());

  }

}
