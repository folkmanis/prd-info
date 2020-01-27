import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpOptions } from "../../library/http/http-options";
import { KastesPreferences } from './preferences';
import { Pasutijums } from './pasutijums';
import { Veikals } from './veikals';


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
  updatePasutijums(pas: Pasutijums): Observable<{ changedRows: number; }> {
    return this.http.post<{ changedRows: number; }>(this.httpPathKastes + 'updatepasutijums', pas, new HttpOptions());
  }

  getPreferencesHttp(): Observable<Partial<KastesPreferences>> {
    return this.http.get<KastesPreferences>(this.httpPathKastes + 'preferences', new HttpOptions());
  }
  /**
   * Iestata jaunas lietotāja preferences kastes modulim
   * Atgriež boolean par pieprasījuma izpildi
   * @param preferences Preferences objekts ar jaunajām preferencēm
   * @param path Relatīvais ceļš
   */
  setPreferencesHttp(preferences: Partial<KastesPreferences>): Observable<boolean> {
    return this.http.post<boolean>(this.httpPathKastes + 'preferences', { preferences }, new HttpOptions());
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
   * Atgriež vienas kastes ierakstu
   * @param path Relatīvais ceļš
   */
  getKasteHttp<T>(path: string): Observable<T[]> {
    return this.http.get<T[]>(this.httpPathKastes + path);
  }

  setGatavsHttp(body: { field: string, id: string, kaste: number, yesno: boolean; }): Observable<{ changedRows: number; }> {
    return this.http.post<{ changedRows: number; }>(this.httpPathKastes + 'gatavs', body, new HttpOptions());
  }

  uploadTableHttp(veikali: Veikals[]): Observable<{ affectedRows: number; }> {
    return this.http.post<{ affectedRows: number; }>(this.httpPathKastes + 'table', { veikali }, new HttpOptions());

  }

}
