import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, merge, Observable, of, Subject } from 'rxjs';
import { catchError, shareReplay, switchMap, tap } from 'rxjs/operators';
import { User } from 'src/app/interfaces';
import { Login } from '../login.interface';
import { LoginApiService } from './login-api.service';

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

  async isLoggedIn(): Promise<boolean> {
    const user = await firstValueFrom(this.user$);
    return !!user;
  }

  async logIn(login: Login): Promise<User> {
    const user = await firstValueFrom(this.api.login(login));
    this.loginUpdate$.next(user);
    return user;
  }

  reloadUser() {
    this.reload$.next();
  }

  async logOut(): Promise<void> {
    await firstValueFrom(this.api.logout());
    this.loginUpdate$.next(null);
  }

  async isModuleAvailable(module: string): Promise<boolean> {
    const user = await firstValueFrom(this.user$);
    return !!user?.preferences.modules.includes(module);
  }

  sessionToken(): Observable<string> {
    return this.api.getSessionToken();
  }

  async updateUser(update: UserUpdate): Promise<User> {
    const user = await firstValueFrom(this.api.patchUser(update));
    this.loginUpdate$.next(user);
    return user;
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
