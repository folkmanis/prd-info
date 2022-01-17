import { Inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { concatMap, filter, map, retry, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { LoginService } from 'src/app/login';
import { APP_PARAMS } from '../app-params';
import { AppParams, MODULES, PreferencesDbModule, SystemPreferences, UserModule } from '../interfaces';
import { SystemPreferencesApiService } from './system-preferences-api';

@Injectable({
  providedIn: 'root'
})
export class SystemPreferencesService {

  private _reloadFromServer$: Subject<void> = new Subject();

  private readonly _preferencesUpdate$ = new Subject<PreferencesDbModule[]>();

  private url$: Observable<string> = this.router.events.pipe(
    filter(ev => ev instanceof NavigationEnd),
    map((ev: NavigationEnd) => ev.url),
    startWith(this.router.routerState.snapshot.url),
  );

  preferencesSnapshot: SystemPreferences = this.params.defaultSystemPreferences;

  preferences$: Observable<SystemPreferences> = merge(
    of(this.params.defaultSystemPreferences),
    this.loginService.user$.pipe( // mainoties user, ielādē no servera
      switchMap(usr => usr ? this._systemPreferences() : of(this.params.defaultSystemPreferences)),
    ),
    this._reloadFromServer$.pipe(
      switchMap(_ => this._systemPreferences()),
    ),
    this._preferencesUpdate$.pipe(
      concatMap(pref => this.api.updateMany(pref)),
      retry(3),
      switchMap(_ => this._systemPreferences()),
    )
  ).pipe(
    tap(pref => this.preferencesSnapshot = pref),
    shareReplay(1),
  );

  modules$ = this.loginService.user$.pipe(
    map(usr => this.params.userModules.filter(mod => usr && usr.preferences.modules.includes(mod.route)))
  );

  activeModules$: Observable<UserModule[]> = combineLatest([
    this.url$,
    this.modules$
  ]).pipe(
    map(findModule),
    shareReplay(1),
  );

  childMenu$: Observable<UserModule[]> = this.activeModules$.pipe(
    map(modules => modules[0]?.childMenu || []),
  );

  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
    private router: Router,
    private loginService: LoginService,
    private api: SystemPreferencesApiService,
  ) { }

  updatePreferences(pref: SystemPreferences) {
    this._preferencesUpdate$.next(
      MODULES.map(module => ({
        module,
        settings: pref[module],
      }))
    );

  }

  private _systemPreferences(): Observable<SystemPreferences> {
    return this.api.get().pipe(
      map(dbpref => Object.assign({}, ...dbpref.map(mod => ({ [mod.module]: mod.settings }))))
    );
  }
}

function findModule([url, modules]: [string, UserModule[]]): UserModule[] {

  const [, ...path] = url.split(/[/;?]/);

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
