import { Injectable, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { merge, Observable, Subject, of, combineLatest, EMPTY } from 'rxjs';
import { map, shareReplay, take, tap, switchMap, filter, mapTo, concatMap } from 'rxjs/operators';
import { AppParams, SystemPreferencesMap, UserModule, SystemPreferencesGroups, ModuleSettings, DbModulePreferences } from '../interfaces';
import { APP_PARAMS } from '../app-params';
import { PrdApiService } from './prd-api/prd-api.service';
import { LoginService } from './login.service';

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
  private _reloadFromServer$: Subject<void> = new Subject();
  private newPreferences$: Subject<SystemPreferencesMap> = new Subject();

  sysPreferences$: Observable<SystemPreferencesMap> = merge(
    of(this.params.defaultSystemPreferences), // sāk ar default
    this.loginService.user$.pipe( // ielādējoties user, ielādē no servera
      filter(usr => !!usr),
      switchMap(() => this.systemPreferencesMap()),
    ),
    this.newPreferences$,  // Jaunas preferences
    this._reloadFromServer$.pipe(
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
    map(usr => this.params.userModules.filter(mod => usr && usr.preferences.modules.includes(mod.route)))
  );
  /* Aktīvie moduļi */
  activeModules$: Observable<UserModule[]> = combineLatest([
    this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)),
    this.modules$
  ]).pipe(
    map(findModule),
    shareReplay(1),
  );
  /** Aktīvais modulis */
  activeModule$: Observable<UserModule | undefined> = this.activeModules$.pipe(
    map(modules => modules[0]),
  );
  /** Aktīvā moduļa child menu */
  childMenu$: Observable<UserModule[]> = this.activeModule$.pipe(
    map(active => active.childMenu || [])
  );

  updatePreferences(pref: DbModulePreferences[]): Observable<boolean | null> {
    return this.prdApi.systemPreferences.update(pref).pipe(
      concatMap(resp => resp > 0 ? of(true) : EMPTY),
      tap(_ => this._reloadFromServer$.next()),
    );
  }

  /**
   * Multicast Observable ar moduļa iestatījumiem
   * @param mod Moduļa nosaukums
   */
  getModulePreferences<T extends ModuleSettings>(mod: SystemPreferencesGroups): Observable<T> {
    return this.sysPreferences$.pipe(
      map(pref => pref.get(mod) as T),
      filter(modPref => !!modPref),
    );
  }

  private systemPreferencesMap(): Observable<SystemPreferencesMap> {
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

function findModule([ev, modules]: [NavigationEnd, UserModule[]]) {
  const [, ...path] = ev.url.split(/[/;]/);

  let userModules: UserModule[] | undefined = [...modules];
  const activeModules: UserModule[] = [];

  for (const segm of path) {
    const module = userModules?.find(mod => mod.route === segm);

    if (!module) { break; }

    userModules = module.childMenu;
    activeModules.push(module);
  }

  return activeModules;
}
