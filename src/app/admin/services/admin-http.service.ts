import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/interfaces';
import { HttpOptions } from '../../library/http/http-options';
import { PrdApiService } from 'src/app/services';

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

  constructor(
    private http: HttpClient,
    private prdApi: PrdApiService,
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

}
