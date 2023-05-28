import { Injectable } from '@angular/core';
import { BehaviorSubject, merge, Observable, of, Subject } from 'rxjs';
import { catchError, map, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
import { User } from 'src/app/interfaces';
import { LoginApiService } from './login-api.service';
import { Login } from '../login.interface';

type UserUpdate = Partial<User>;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loginUpdate$ = new Subject<User | null>();

  private reload$ = new BehaviorSubject<void>(null);

  user$: Observable<User> = merge(
    this.reload$.pipe(switchMap(() => this.getLogin())),
    this.loginUpdate$,
  ).pipe(
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
      tap(usr => this.loginUpdate$.next(usr)),
    );
  }

  reloadUser() {
    this.reload$.next();
  }

  logOut(): Observable<unknown> {
    return this.api.logout().pipe(
      tap(() => this.loginUpdate$.next(null)),
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
      tap(resp => this.loginUpdate$.next(resp)),
    );
  }

  getSessionId(): Observable<string> {
    return this.api.getSessionId();
  }

  private getLogin(): Observable<User | null> {
    return this.api.getLogin().pipe(
      catchError(() => of(null))
    );
  }

}
