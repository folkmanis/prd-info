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
import { User, UserPreferences } from '/home/dev/prd-info-node/src/lib/user-class';
export { User, UserPreferences } from '/home/dev/prd-info-node/src/lib/user-class';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, pipe, Subject, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { merge } from 'rxjs/index';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private userSubj = new Subject<User | null>();
  private httpPathLogin = '/data/login/';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
  ) { }

  user$: Observable<User | null> = merge(this.userSubj, this.getUserHttp());

  logIn(login: Login): Observable<boolean> {
    return this.loginHttp(login).pipe(
      tap((resp) => this.userSubj.next(resp)),
      tap(resp => console.log(resp)),
      map((resp) => !!resp),
    );
  }

  logOut(): Observable<boolean> {
    return this.logoutHttp().pipe(
      map((resp) => resp.logout > 0),
      tap((resp) => !resp || this.userSubj.next(null)),
    );
  }

  isLogin(): Observable<boolean> {
    return this.getUserHttp().pipe(
      map((usr) => !!usr),
    );
  }

  isAdmin(): Observable<boolean> {
    return this.getUserHttp().pipe(
      map((usr) => !!usr && !!usr.admin)
    );
  }

  getUser(): Observable<User> {
    return this.getUserHttp();
  }

  isModule(mod: string): Observable<boolean> {
    return this.getUser().pipe(
      map(usr => !!usr.preferences.modules.find(m => m === mod))
    );
  }

  private getUserHttp(): Observable<User | null> {
    return this.http.get<User>(this.httpPathLogin + 'user', this.httpOptions).pipe(
      map((usr) => usr.username ? usr : null)
    );
  }

  private loginHttp(login: Login): Observable<User | null> {
    return this.http.post<User>(this.httpPathLogin + 'login', login, this.httpOptions).pipe(
      map((usr) => usr.username ? usr : null),
      catchError(this.handleError('Invalid login: ' + login, null)),
    );
  }

  private logoutHttp(): Observable<LogoutResponse> {
    return this.http.post<LogoutResponse>(this.httpPathLogin + 'logout', {}, this.httpOptions);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation, error);
      return of(result as T);
    };
  }
}
