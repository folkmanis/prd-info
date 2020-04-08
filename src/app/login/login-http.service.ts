/**
 * /data/login
 *
 * POST /data/login/login
 * {
 * username: string;
 * password: string;
 * }
 *
 * User
 *
 *
 * POST /data/login/logout
 * {}
 *
 * GET /data/login/user
 * user: string
 */

export class Login {
  username: string;
  password: string;
}
interface LogoutResponse {
  logout: number;
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/login/user';
import { DbModulePreferences, ModuleSettings, SystemPreferences, SystemPreferencesGroups } from '../library/classes/system-preferences-class';
import { HttpOptions } from '../library/http/http-options';



@Injectable({
  providedIn: 'root'
})
export class LoginHttpService {
  private httpPathLogin = '/data/login/';
  private httpPathPreferences = '/data/preferences/';

  constructor(
    private http: HttpClient
  ) { }

  getUserHttp(): Observable<User | null> {
    return this.http.get<User>(this.httpPathLogin + 'user', new HttpOptions()).pipe(
      map((usr) => usr.username ? usr : null)
    );
  }

  loginHttp(login: Login): Observable<User | null> {
    return this.http.post<User>(this.httpPathLogin + 'login', login, new HttpOptions()).pipe(
      map((usr) => usr.username ? usr : null),
    );
  }

  logoutHttp(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(this.httpPathLogin + 'logout', {}, new HttpOptions());
  }

  getAllSystemPreferencesHttp(): Observable<SystemPreferences> {
    return this.http.get<DbModulePreferences[]>(this.httpPathPreferences + 'all', new HttpOptions()).pipe(
      map(dbpref => dbpref.reduce((acc, curr) => acc.set(curr.module, curr.settings), new Map<SystemPreferencesGroups, ModuleSettings>()))
    );
  }

}
