import { computed, inject, Injectable, Signal } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, map, merge, Observable, of, shareReplay, Subject, switchMap } from 'rxjs';
import { LoginUser, LoginUserUpdate } from 'src/app/interfaces';
import { Login } from '../login.interface';
import { LoginApiService } from './login-api.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private api = inject(LoginApiService);

  private loginUpdate$ = new Subject<LoginUser | null>();
  private reload$ = new BehaviorSubject<void>(undefined);

  user$: Observable<LoginUser | null> = merge(this.reload$.pipe(switchMap(() => this.api.getLogin())), this.loginUpdate$).pipe(
    catchError(() => of(null)),
    shareReplay(1),
  );
  user = toSignal(this.user$);

  isModule = (module: string): Signal<boolean> => computed(() => !!this.user()?.preferences.modules.includes(module));

  async isLoggedIn(): Promise<boolean> {
    return !!(await firstValueFrom(this.user$));
  }

  async logIn(login: Login): Promise<LoginUser> {
    const user = await this.api.login(login);
    this.loginUpdate$.next(user);
    return user;
  }

  reloadUser() {
    this.reload$.next();
  }

  async logOut(): Promise<void> {
    await this.api.logout();
    this.loginUpdate$.next(null);
  }

  isModuleAvailable(module?: string): Observable<boolean> {
    return this.user$.pipe(map((user) => !!module && !!user?.preferences.modules.includes(module)));
  }

  sessionToken(): Observable<string> {
    return this.api.getSessionToken();
  }

  async updateUser(update: LoginUserUpdate): Promise<LoginUser> {
    const user = await this.api.patchUser(update);
    this.loginUpdate$.next(user);
    return user;
  }

  async getSessionId(): Promise<string> {
    return this.api.getSessionId();
  }
}
