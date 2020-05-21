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

import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as loginSelectors from '../selectors/login-selectors';
import { BehaviorSubject, merge, Observable, of, ReplaySubject, Subject } from 'rxjs';
import { filter, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { User } from 'src/app/interfaces';
import {
  Login,
  SystemPreferences,
  UserModule,
  AppParams,
  SystemPreferencesGroups,
  ModuleSettings
} from 'src/app/interfaces';
import { USER_MODULES } from '../user-modules';
import { APP_PARAMS } from 'src/app/app-params';
import { PrdApiService } from 'src/app/services';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _sysPrefReload$: Subject<SystemPreferences> = new Subject();

  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
    private prdApi: PrdApiService,
    private store: Store,
  ) { }
  activeModule$: BehaviorSubject<UserModule | null> = new BehaviorSubject(null);
  /**
   * Multicast Observable ar aktīvā lietotāja informāciju
   * Dod rezultātu, mainoties lietotājam (login/logout)
   */
  user$: Observable<User | null> = this.store.select(loginSelectors.user);
  /**
   * Multicast Observable ar system preferences objektu
   * Mainās, mainoties lietotājam
   */
  sysPreferences$: Observable<SystemPreferences> = merge(
    of(this.params.defaultSystemPreferences), // sāk ar default
    this.user$.pipe( // ielādējoties user, ielādē no servera
      filter(usr => !!usr),
      switchMap(() => this.systemPreferencesMap()),
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
  isLogin$: Observable<boolean> = this.store.select(loginSelectors.selectLogin).pipe(
    filter(login => login.initialised),
    map(login => !!login.user),
    take(1),
  );
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
      switchMap(usr => usr ? this.systemPreferencesMap() : of(this.params.defaultSystemPreferences)),
      tap(pref => this._sysPrefReload$.next(pref)),
      map(pref => !!pref),
    );
  }

  private systemPreferencesMap(): Observable<SystemPreferences> {
    return this.prdApi.systemPreferences.get().pipe(
      map(
        dbpref => dbpref.reduce(
          (acc, curr) => acc.set(curr.module, curr.settings),
          new Map<SystemPreferencesGroups, ModuleSettings>()
        )
      )
    );
  }

}
