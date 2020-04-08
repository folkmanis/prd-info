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
import { BehaviorSubject, merge, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { User } from 'src/app/login/user';
import { DEFAULT_SYSTEM_PREFERENCES, SystemPreferences } from '../library/classes/system-preferences-class';
import { UserModule } from '../library/classes/user-module-interface';
import { USER_MODULES } from '../user-modules';
import { Login, LoginHttpService } from './login-http.service';
export { SystemSettings } from '../library/classes/system-preferences-class';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _user$: ReplaySubject<User | null>;
  private _sysPrefReload$: Subject<SystemPreferences> = new Subject();

  constructor(
    private http: LoginHttpService,
  ) { }
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
  sysPreferences$: Observable<SystemPreferences> = merge(
    of(DEFAULT_SYSTEM_PREFERENCES), // sāk ar default
    this.user$.pipe( // ielādējoties user, ielādē no servera
      filter(usr => !!usr),
      switchMap(() => this.http.getAllSystemPreferencesHttp()),
    ),
    this._sysPrefReload$,  // Ielāde pisepiedu kārtā
  ).pipe(
    shareReplay(1), // kešo
  );
  /**
   * Lietotājam pieejamie Moduļi
   * Multicast Observable
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
   * Piespiedu kārtā pārlādē preferences no servera
   */
  reloadPreferences(): Observable<boolean> {
    return this.user$.pipe(
      take(1),
      switchMap(usr => usr ? this.http.getAllSystemPreferencesHttp() : of(DEFAULT_SYSTEM_PREFERENCES)),
      tap(pref => this._sysPrefReload$.next(pref)),
      map(pref => !!pref),
    );
  }
}
