import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { map, tap, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { USER_MODULES } from '../user-modules';
import { UserModule } from "../library/classes/user-module-interface";
import { SystemPreferences, ModulePreferences, DEFAULT_SYSTEM_PREFERENCES } from '../library/classes/system-preferences-class';
export { SystemSettings } from '../library/classes/system-preferences-class';
import { LoginHttpService, User, Login } from './login-http.service';
export { User, Login } from './login-http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loaded = false;
  user$: BehaviorSubject<User | null>;
  modules$: BehaviorSubject<UserModule[]>;
  activeModule$: BehaviorSubject<UserModule | null>;
  private sysPref$: BehaviorSubject<SystemPreferences> = new BehaviorSubject(DEFAULT_SYSTEM_PREFERENCES);

  constructor(
    private http: LoginHttpService,
  ) {
    this.user$ = new BehaviorSubject<User | null>(null);
    this.modules$ = new BehaviorSubject<UserModule[]>([]);
    this.activeModule$ = new BehaviorSubject<UserModule | null>(null);
    this.user$.pipe(
      distinctUntilChanged()
    ).subscribe(usr => this.modules$.next(
      USER_MODULES.filter(mod => usr && usr.preferences.modules.includes(mod.value))
    ));
  }

  connect() {
    if (!this.loaded) {
      this.isLogin().pipe(
        filter(login => login),
        switchMap(() => this.reloadPreferences()),
      ).subscribe();
    }
  }

  logIn(login: Login): Observable<boolean> {
    return this.http.loginHttp(login).pipe(
      tap(usr => this.user$.next(usr)),
      map(usr => !!usr),
      tap(login => this.loaded = login),
      switchMap(login => login ? this.reloadPreferences() : of(null)),
    );
  }

  logOut(): Observable<boolean> {
    return this.http.logoutHttp().pipe(
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
      return this.http.getUserHttp().pipe(
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

  setActiveModule(mod: UserModule | null) {
    this.activeModule$.next(mod);
  }

  childMenu(root: string): Observable<Partial<UserModule>[]> {
    return this.modules$.pipe(
      map(mod => mod.find(md => md.value === root).childMenu || []),
    );
  }

  get systemPreferences(): Subject<SystemPreferences> {
    return this.sysPref$;
  }

  reloadPreferences(): Observable<boolean> {
    return this.http.getAllSystemPreferencesHttp().pipe(
      tap(pref => this.sysPref$.next(pref)),
      map(pref => !!pref),
    );
  }
}
