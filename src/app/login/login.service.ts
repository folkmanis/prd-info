/**
 * Piedāvā:
 * user$ - lietotāja info pakete
 * modules$ - pieejamie moduļi
 * isLogin$ - vai ir pieslēgums
 * login() - mēģinājums pieslēgties
 * logout() - atslēgšanās
 * 
 * Klausās:
 * login()
 * logout()
 * 
 * 
 */

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of, Subject, merge, ReplaySubject } from 'rxjs';
import { map, tap, distinctUntilChanged, filter, switchMap, shareReplay, take, exhaustMap } from 'rxjs/operators';
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

  private _user$: ReplaySubject<User | null>;
  private _sysPref$: ReplaySubject<SystemPreferences>;

  constructor(
    private http: LoginHttpService,
  ) {
    // this.user$ = new BehaviorSubject<User | null>(null);
  }
  activeModule$: BehaviorSubject<UserModule | null> = new BehaviorSubject(null);
  /**
   * Multicast Observable ar aktīvā lietotāja informāciju
   * Dod rezultātu, mainoties lietotājam (login/logout)
   */
  get user$(): Observable<User | null> {
    if (!this._user$) {
      this._user$ = new ReplaySubject(1);
      this.http.getUserHttp().pipe(
        tap(usr => this._user$.next(usr)),
      ).subscribe();
    }
    return this._user$;
  }
  /**
   * Multicast Observable ar system preferences objektu
   * Mainās, mainoties lietotājam
   */
  get sysPreferences$(): Observable<SystemPreferences> {
    if (!this._sysPref$) {
      this._sysPref$ = new ReplaySubject(1);
      this.user$.pipe(
        switchMap(usr => usr ? this.http.getAllSystemPreferencesHttp() : of(DEFAULT_SYSTEM_PREFERENCES)),
      ).subscribe(pref => this._sysPref$.next(pref));
    }
    return this._sysPref$;
  }
  /**
   * Lietotājam pieejamie Moduļi
   */
  get modules$(): Observable<UserModule[]> {
    return this.user$.pipe(
      map(usr => USER_MODULES.filter(mod => usr && usr.preferences.modules.includes(mod.value)))
    );
  }
  /**
   * Vai ir aktīvs login
   */
  get isLogin$(): Observable<boolean> {
    return this.user$.pipe(
      map(usr => !!usr),
      take(1)
    );
  }
  /**
   * Login. true - veiksmīgi, false - neveiksmīgi
   * Bez sīkākas informācijas no servera
   * @param login Lietotājvārda objekts
   */
  logIn(login: Login): Observable<boolean> {
    return this.http.loginHttp(login).pipe(
      tap(usr => this._user$.next(usr)),
      map(usr => !!usr),
    );
  }
  /**
   * Vai lietotājam ir pieejams modulis mod
   * @param mod moduļa nosaukums
   */
  isModule(mod: string): Observable<boolean> {
    return this.user$.pipe(
      take(1),
      map(usr => !!usr.preferences.modules.find(m => m === mod)),
    );
  }
  /**
   * Atslēgties.
   * Iztukšo lietotāja objektu, līdz ar to mainās visas preferences
   */
  logOut(): Observable<boolean> {
    return this.http.logoutHttp().pipe(
      map(resp => resp.logout > 0),
      tap(resp => !resp || this._user$.next(null)),
    );
  }
  /**
   * activeModule$ ziņo par aktīvo moduli
   * setActiveModule izsūta paziņojumu par moduļa maiņu
   * @param mod moduļa objekts
   */
  setActiveModule(mod: UserModule | null): void {
    this.activeModule$.next(mod);
  }

  childMenu(root: string): Observable<Partial<UserModule>[]> {
    return this.modules$.pipe(
      map(mod => mod.find(md => md.value === root).childMenu || []),
    );
  }
  /**
   * Piespiedu kārtā pārlādē preferences.
   */
  reloadPreferences(): Observable<boolean> {
    return this.user$.pipe(
      switchMap(usr => usr ? this.http.getAllSystemPreferencesHttp() : of(DEFAULT_SYSTEM_PREFERENCES)),
      tap(pref => this._sysPref$.next(pref)),
      map(pref => !!pref),
    );
  }
}
