import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, UrlSegment } from '@angular/router';
import { merge, Observable, of, Subject } from 'rxjs';
import { concatMap, filter, map, retry, shareReplay, switchMap, tap } from 'rxjs/operators';
import { LoginService } from 'src/app/login';
import { getAppParams } from '../app-params';
import { MODULES, PreferencesDbModule, SystemPreferences, UserModule } from '../interfaces';
import { SystemPreferencesApiService } from './system-preferences-api';

@Injectable({
  providedIn: 'root',
})
export class SystemPreferencesService {
  private _reloadFromServer$: Subject<void> = new Subject();
  private router = inject(Router);
  private loginService = inject(LoginService);
  private api = inject(SystemPreferencesApiService);

  private readonly _preferencesUpdate$ = new Subject<PreferencesDbModule[]>();

  private url = toSignal(
    this.router.events.pipe(
      filter((ev) => ev instanceof NavigationEnd),
      map((ev: NavigationEnd) => ev.url),
    ),
    { initialValue: this.router.routerState.snapshot.url },
  );

  defaultPreferences: SystemPreferences = getAppParams('defaultSystemPreferences');

  preferences$: Observable<SystemPreferences> = merge(
    of(this.defaultPreferences),
    this.loginService.user$.pipe(
      // mainoties user, ielādē no servera
      switchMap((usr) => (usr ? this._systemPreferences() : of(this.defaultPreferences))),
    ),
    this._reloadFromServer$.pipe(switchMap((_) => this._systemPreferences())),
    this._preferencesUpdate$.pipe(
      concatMap((pref) => this.api.updateMany(pref)),
      retry(3),
      switchMap((_) => this._systemPreferences()),
    ),
  ).pipe(
    tap((pref) => (this.defaultPreferences = pref)),
    shareReplay(1),
  );

  private readonly userModules = getAppParams('userModules');

  modules$ = this.loginService.user$.pipe(
    switchMap((usr) =>
      of(this.userModules.filter((mod) => usr && usr.preferences.modules.includes(mod.route))).pipe(map((modules) => (usr.google ? modules : removeGmail(modules)))),
    ),
  );
  modules = toSignal(this.modules$, { initialValue: [] });

  activeModules = computed(() => findModulesPath(this.url(), this.modules()));

  childMenu = computed(() => this.activeModules()[0]?.childMenu || []);

  updatePreferences(pref: SystemPreferences) {
    this._preferencesUpdate$.next(
      MODULES.map((module) => ({
        module,
        settings: pref[module],
      })),
    );
  }

  private _systemPreferences(): Observable<SystemPreferences> {
    return this.api.getAll().pipe(map((dbpref) => Object.assign({}, ...dbpref.map((mod) => ({ [mod.module]: mod.settings })))));
  }
}

export function findModulesPath(url: string | UrlSegment[], modules: UserModule[]): UserModule[] {
  let segments: string[];
  if (typeof url === 'string') {
    const [, ...path] = url.split(/[/;?]/);
    segments = path;
  } else {
    segments = url.map((segm) => segm.path);
  }

  let userModules: UserModule[] | undefined = [...modules];
  const activeModules: UserModule[] = [];

  for (const segm of segments) {
    const module = userModules?.find((mod) => mod.route === segm);

    if (!module) {
      break;
    }

    userModules = module.childMenu;
    activeModules.push(module);
  }

  return activeModules;
}

function removeGmail(modules: UserModule[]): UserModule[] {
  return modules.filter((module) => module.name !== 'gmail').map((module) => (module.childMenu ? { ...module, childMenu: removeGmail(module.childMenu) } : module));
}
