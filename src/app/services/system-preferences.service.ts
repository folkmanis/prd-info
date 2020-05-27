import { Injectable, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { merge, Observable, Subject, of } from 'rxjs';
import { combineLatest } from 'rxjs/index';
import { map, shareReplay, take, tap, switchMap, filter, mapTo } from 'rxjs/operators';
import { AppParams, SystemPreferences, UserModule, SystemPreferencesGroups, ModuleSettings } from '../interfaces';
import { APP_PARAMS } from '../app-params';
import { PrdApiService } from './prd-api/prd-api.service';
import { LoginService } from './login.service';
import { USER_MODULES } from '../user-modules';

@Injectable({
  providedIn: 'root'
})
export class SystemPreferencesService {

  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
    private router: Router,
    private prdApi: PrdApiService,
    private loginService: LoginService,
  ) { }
  /** Piespiedu ielāde no servera */
  reloadFromServer$: Subject<void> = new Subject();
  private newPreferences$: Subject<SystemPreferences> = new Subject();

  sysPreferences$: Observable<SystemPreferences> = merge(
    of(this.params.defaultSystemPreferences), // sāk ar default
    this.loginService.user$.pipe( // ielādējoties user, ielādē no servera
      filter(usr => !!usr),
      switchMap(() => this.systemPreferencesMap()),
    ),
    this.newPreferences$,  // Jaunas preferences
    this.reloadFromServer$.pipe(
      switchMap(() => this.systemPreferencesMap()),
    )
  ).pipe(
    shareReplay(1), // kešo
  );
  /**
   * Lietotājam pieejamie Moduļi
   * Multicast Observable
   */
  modules$ = this.loginService.user$.pipe(
    map(usr => USER_MODULES.filter(mod => usr && usr.preferences.modules.includes(mod.value)))
  );
  /** Aktīvais modules */
  activeModule$: Observable<UserModule | undefined> = combineLatest([
    this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)),
    this.modules$
  ]).pipe(
    map(([ev, modules]: [NavigationEnd, UserModule[]]) => modules.find(mod => mod.route === ev.url.split('/')[1])),
    shareReplay(1),
  );
  /** Aktīvā moduļa child menu */
  childMenu$: Observable<Partial<UserModule>[]> = this.activeModule$.pipe(
    map(active => active.childMenu || [])
  );

  updateModulePreferences(modName: SystemPreferencesGroups, modPref: ModuleSettings): Observable<boolean> {
    return this.sysPreferences$.pipe(
      take(1),
      switchMap(sysPref =>
        this.prdApi.systemPreferences.updateOne(
          modName,
          { settings: modPref }
        ).pipe(
          filter(update => !!update),
          map(() => new Map(sysPref).set(modName, modPref)),
          tap(newPref => this.newPreferences$.next(newPref)),
          mapTo(true),
        )
      )
    );
  }

  getModulePreferences<T extends ModuleSettings>(mod: SystemPreferencesGroups): Observable<T> {
    return this.sysPreferences$.pipe(
      map(pref => pref.get(mod) as T),
      filter(modPref => !!modPref),
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
