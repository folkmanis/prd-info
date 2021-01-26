import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, EMPTY, merge, Observable, of, Subject } from 'rxjs';
import { concatMap, filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { APP_PARAMS } from '../app-params';
import { AppParams, PreferencesDbModule, SystemPreferences, UserModule } from '../interfaces';
import { LoginService } from './login.service';
import { PrdApiService } from './prd-api/prd-api.service';

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

  preferences$: Observable<SystemPreferences> = merge(
    of(this.params.defaultSystemPreferences), // sāk ar default
    this.loginService.user$.pipe( // ielādējoties user, ielādē no servera
      filter(usr => !!usr),
      switchMap(_ => this._systemPreferences()),
    ),
    this._reloadFromServer$.pipe(
      switchMap(_ => this._systemPreferences()),
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

  updatePreferences(pref: PreferencesDbModule[]): Observable<boolean | null> {
    return this.prdApi.systemPreferences.update(pref).pipe(
      concatMap(resp => resp > 0 ? of(true) : EMPTY),
      tap(_ => this._reloadFromServer$.next()),
    );
  }

  private _systemPreferences(): Observable<SystemPreferences> {
    return this.prdApi.systemPreferences.get().pipe(
      map(dbpref => Object.assign({}, ...dbpref.map(mod => ({ [mod.module]: mod.settings }))))
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
