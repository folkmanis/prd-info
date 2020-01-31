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
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError, distinctUntilChanged } from 'rxjs/operators';
import { USER_MODULES, UserModule } from '../user-modules';



@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private httpPathLogin = '/data/login/';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  private loaded = false;
  user$: BehaviorSubject<User | null>;
  modules$: BehaviorSubject<UserModule[]>;

  constructor(
    private http: HttpClient,
  ) {
    this.user$ = new BehaviorSubject<User | null>(null);
    this.modules$ = new BehaviorSubject<UserModule[]>([]);
    this.user$.pipe(
      distinctUntilChanged()
    ).subscribe(usr => this.modules$.next(
      USER_MODULES.filter(mod => usr && usr.preferences.modules.includes(mod.value))
    ));
  }

  logIn(login: Login): Observable<boolean> {
    return this.loginHttp(login).pipe(
      tap(usr => this.user$.next(usr)),
      map(usr => !!usr),
      tap(() => this.loaded = true),
    );
  }

  logOut(): Observable<boolean> {
    return this.logoutHttp().pipe(
      map((resp) => resp.logout > 0),
      tap((resp) => !resp || this.user$.next(null)),
    );
  }

  isLogin(): Observable<boolean> {
    return this.getUser().pipe(
      map(usr => !!usr),
    );
  }

  isAdmin(): Observable<boolean> {
    return this.getUser().pipe(
      map((usr) => !!usr && !!usr.admin)
    );
  };

  getUser(): Observable<User> {
    if (this.loaded) {
      return of(this.user$.value);
    } else {
      return this.getUserHttp().pipe(
        tap(usr => {
          this.user$.next(usr);
          this.loaded = true;
        }),
      );
    }
  }

  isModule(mod: string): Observable<boolean> {
    return this.getUser().pipe(
      map(usr => !!usr.preferences.modules.find(m => m === mod)),
    );
  }

  private updateModules() {
    this.user$.subscribe(usr => {
      const data = usr ? USER_MODULES.filter(mod => usr.preferences.modules.includes(mod.value)) : [];
      this.modules$.next(data);
    });
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
