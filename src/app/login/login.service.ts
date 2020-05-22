/**
 * Piedāvā:
 * user$ - lietotāja info pakete
 * modules$ - pieejamie moduļi
 * isLogin$ - vai ir pieslēgums
 *
 */

import { Injectable, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import * as systemSelectors from '../selectors';
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
  /**
   * Multicast Observable ar aktīvā lietotāja informāciju
   * Dod rezultātu, mainoties lietotājam (login/logout)
   */
  user$: Observable<User | null> = this.store.select(systemSelectors.user);

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
