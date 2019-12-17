export { User, UserPreferences } from '/home/dev/prd-info-node/src/lib/user-class';
import { User, UserPreferences } from '/home/dev/prd-info-node/src/lib/user-class';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

export interface UserList {
  count: number,
  users: User[],
}


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private httpPathUsers = '/data/users/';

  constructor(
    private http: HttpClient,
  ) { }

  getUsersHttp(): Observable<UserList> {
    return this.http.get<UserList>(this.httpPathUsers + 'list');
  }

}
