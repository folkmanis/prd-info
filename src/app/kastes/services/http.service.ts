import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Preferences, Pasutijums } from './preferences.service';
import { User } from './user.service';

@Injectable({
  providedIn: 'root'
})

export class HttpService {
  private httpPathPrefs = '/data/preferences/';
  private httpPathUser = '/data/login/';
  private httpPathKastes = '/data/kastes/';

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Izsniedz lietotāja vārdu, pamatojoties uz sesijas cepumu
   * Ja sesijas nav, tad kļūda 401
   * @param path Relatīvais ceļš
   */
  getUserHttp(path = 'user/'): Observable<User> {
    return this.http.get<User>(this.httpPathUser + path, this.httpOptions);
  }
  logInHttp(login: { username: string, pass: string }, path = 'login/'): Observable<User | null> {
    return this.http.post<User | null>(this.httpPathUser + path, login, this.httpOptions);
  }
  logOutHttp(path = 'logout/'): Observable<number> {
    return this.http.post<number>(this.httpPathUser + path, {});
  }
  /**
   * Saņem preferences no servera
   * @param path Relatīvais ceļš
   * Atgiež Observable no Preferences objekta
   */
  getPreferencesHttp(userId: number, path = 'getpreferences/'): Observable<Preferences> {
    return this.http.get<Preferences>(this.httpPathPrefs + path + '?user=' + userId);
  }
  /**
   * Saņem pasūtījumu sarakstu no servera
   * @param path Relatīvais ceļš
   * Atgriež Observable masīvu no Pasūtījumu objekta
   */
  getPasutijumiHttp(path: string = 'pasnames/'): Observable<Pasutijums[]> {
    return this.http.get<Pasutijums[]>(this.httpPathPrefs + path);
  }

  /**
   * Iestata jaunas preferences
   * @param preferences Preferences objekts ar jaunajām preferencēm
   * @param path Relatīvais ceļš
   * Atgriež Observable no SQL servera atbildes par veiktajiem darbiem
   */
  setPreferencesHttp(preferences: Preferences, path: string = 'setprefs/'): Observable<{ changedRows: number }> {
    return this.http.post<{ changedRows: number }>(this.httpPathPrefs + path, { preferences }, this.httpOptions);
  }

  getKastesHttp<T>(path: string): Observable<T[]> {
    return this.http.get<T[]>(this.httpPathKastes + path);
  }
  /**
   * Atgriež vienas kastes ierakstu
   * @param path Relatīvais ceļš
   */
  getKasteHttp<T>(path: string): Observable<T[]> {
    return this.http.get<T[]>(this.httpPathKastes + path);
  }

  setGatavsHttp(body: { id: number, yesno: number }, path: string = 'gatavs/'): Observable<{ changedRows: number }> {
    return this.http.post<{ changedRows: number }>(this.httpPathKastes + path, body, this.httpOptions);
  }

}
