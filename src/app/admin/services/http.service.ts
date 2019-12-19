export { User, UserPreferences } from '/home/dev/prd-info-node/src/lib/user-class';
import { User, UserPreferences } from '/home/dev/prd-info-node/src/lib/user-class';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface UserList {
  count: number,
  users: User[],
}


interface UpdateResponse {
  success: boolean;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private httpPathUsers = '/data/users/';
  /**   Klientu kodi ir arhīva datubāzē
   * TODO izveidot klientu datubāzi uz    */
  private httpPathSearch = '/data/xmf-search/';

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

}
