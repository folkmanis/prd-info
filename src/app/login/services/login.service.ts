import { Injectable } from '@angular/core';
import { merge, Observable, of, Subject } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
import { User } from 'src/app/interfaces';
import { LoginApiService } from './login-api.service';
import { Login } from '../login.interface';
import { combineReload } from 'src/app/library/rxjs';

type UserUpdate = Partial<User>;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly _updateLogin$ = new Subject<User | null>();

  private reload$ = new Subject<void>();

  user$: Observable<User> = merge(
    combineReload(of({}), this.reload$).pipe(
      switchMap(() => this.api.getLogin()),
    ),
    this._updateLogin$,
  ).pipe(
    catchError(() => of(null)),
    shareReplay(1),
  );

  sessionId$ = this.user$.pipe(
    switchMap(_ => this.api.getSessionId()),
    shareReplay(1),
  );

  constructor(
    private api: LoginApiService,
  ) { }

  isLogin(): Observable<boolean> {
    return this.user$.pipe(
      map(usr => !!usr),
      take(1)
    );
  }

  logIn(login: Login): Observable<User> {
    return this.api.login(login).pipe(
      tap(usr => this._updateLogin$.next(usr)),
    );
  }

  reloadUser() {
    this.reload$.next();
  }

  logOut(): Observable<unknown> {
    return this.api.logout().pipe(
      tap(() => this._updateLogin$.next(null)),
    );
  }

  isModule(mod: string): Observable<boolean> {
    return this.user$.pipe(
      map(usr => usr?.hasModule(mod)),
      take(1),
    );
  }

  sessionToken(): Observable<string> {
    return this.api.getSessionToken();
  }

  updateUser(update: UserUpdate) {
    return this.api.patchUser(update).pipe(
      tap(resp => this._updateLogin$.next(resp)),
    );
  }

}
