import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { concatMap, filter, map, retry, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { LoginService } from 'src/app/login';
import { getAppParams } from '../app-params';
import { MODULES, PreferencesDbModule, SystemPreferences, UserModule } from '../interfaces';
import { SystemPreferencesApiService } from './system-preferences-api';
import { toSignal } from '@angular/core/rxjs-interop';

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

  defaultPreferences: SystemPreferences = getAppParams('defaultSystemPreferences');

  preferences$: Observable<SystemPreferences> = merge(
    of(this.defaultPreferences),
    this.loginService.user$.pipe( // mainoties user, ielādē no servera
      switchMap(usr => usr ? this._systemPreferences() : of(this.defaultPreferences)),
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
    tap(pref => this.defaultPreferences = pref),
    shareReplay(1),
  );

  private readonly userModules = getAppParams('userModules');

  modules$ = this.loginService.user$.pipe(
    switchMap(usr => of(this.userModules.filter(mod => usr && usr.preferences.modules.includes(mod.route))).pipe(
      map(modules => usr.google ? modules : removeGmail(modules)),
    ))
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
  childMenu = toSignal(this.childMenu$, { initialValue: [] });

  constructor(
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
    return this.api.getAll().pipe(
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

function removeGmail(modules: UserModule[]): UserModule[] {
  return modules
    .filter(module => module.name !== 'gmail')
    .map(module => module.childMenu ? { ...module, childMenu: removeGmail(module.childMenu) } : module);
}
