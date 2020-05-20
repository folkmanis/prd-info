import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/interfaces';
import { DbModulePreferences, ModuleSettings, SystemPreferences, SystemPreferencesGroups } from 'src/app/interfaces';
import { HttpOptions } from '../../library/http/http-options';

export interface UserList {
  count: number;
  users: User[];
}

interface UpdateResponse {
  success: boolean;
  error?: string;
}

@Injectable()
export class AdminHttpService {
  private httpPathUsers = '/data/users/';
  private httpPathSearch = '/data/xmf-search/';
  private httpPathPreferences = '/data/preferences/';

  constructor(
    private http: HttpClient,
  ) { }

  getUsersHttp(): Observable<UserList> {
    return this.http.get<UserList>(this.httpPathUsers + 'list');
  }

  getUserHttp(username: string): Observable<User> {
    return this.http.get<User>(this.httpPathUsers + `user?username=${username}`);
  }

  getCustomersHttp(): Observable<string[]> {
    return this.http.get<string[]>(this.httpPathSearch + 'customers');
  }

  updateUserHttp(user: Partial<User>): Observable<UpdateResponse> {
    return this.http.post<UpdateResponse>(this.httpPathUsers + 'update', user);
  }

  updatePasswordHttp(username: string, password: string): Observable<boolean> {
    return this.http.post<UpdateResponse>(this.httpPathUsers + 'password', { username, password }).pipe(
      map(resp => resp.success)
    );
  }

  addUserHttp(user: Partial<User>): Observable<boolean> {
    return this.http.post<UpdateResponse>(this.httpPathUsers + 'add', user).pipe(
      map(resp => resp.success)
    );
  }

  deleteUserHttp(username: string): Observable<boolean> {
    return this.http.delete<UpdateResponse>(this.httpPathUsers + 'user', new HttpOptions({ username })).pipe(
      map(resp => resp.success)
    );
  }

  getModuleSystemPreferencesHttp(mod: SystemPreferencesGroups): Observable<ModuleSettings> {
    return this.http.get<{ settings: ModuleSettings; }>(this.httpPathPreferences + 'single', new HttpOptions({ module: mod })).pipe(
      map(sett => sett.settings)
    );
  }

  getAllSystemPreferencesHttp(): Observable<SystemPreferences> {
    return this.http.get<DbModulePreferences[]>(this.httpPathPreferences + 'all', new HttpOptions()).pipe(
      map(dbpref => dbpref.reduce((acc, curr) => acc.set(curr.module, curr.settings), new Map<SystemPreferencesGroups, ModuleSettings>()))
    );
  }

  updateModuleSystemPreferences(modName: SystemPreferencesGroups, preferences: ModuleSettings): Observable<boolean> {
    return this.http.put<{ ok: number; }>(
      this.httpPathPreferences + 'update',
      { preferences: { module: modName, settings: preferences } },
      new HttpOptions()
    ).pipe(
      map(res => !!res.ok)
    );
  }

}
