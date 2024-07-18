import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, firstValueFrom, map, merge, Observable, of, shareReplay, Subject, switchMap } from 'rxjs';
import { User } from 'src/app/interfaces';
import { Login } from '../login.interface';
import { LoginApiService } from './login-api.service';

type UserUpdate = Partial<User>;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private api = inject(LoginApiService);

  private loginUpdate$ = new Subject<User | null>();
  private reload$ = new BehaviorSubject<void>(null);

  user$: Observable<User> = merge(this.reload$.pipe(switchMap(() => this.api.getLogin())), this.loginUpdate$).pipe(
    catchError(() => of(null)),
    shareReplay(1),
  );

  async isLoggedIn(): Promise<boolean> {
    return !!(await firstValueFrom(this.user$));
  }

  async logIn(login: Login): Promise<User> {
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

  isModuleAvailable(module: string): Observable<boolean> {
    return this.user$.pipe(map((user) => !!user?.preferences.modules.includes(module)));
  }

  sessionToken(): Observable<string> {
    return this.api.getSessionToken();
  }

  async updateUser(update: UserUpdate): Promise<User> {
    const user = await this.api.patchUser(update);
    this.loginUpdate$.next(user);
    return user;
  }

  async getSessionId(): Promise<string> {
    return this.api.getSessionId();
  }
}
