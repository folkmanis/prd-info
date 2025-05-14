import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, UrlSegment } from '@angular/router';
import { concatMap, filter, map, merge, Observable, of, retry, shareReplay, Subject, switchMap, tap } from 'rxjs';
import { LoginService } from 'src/app/login';
import { getAppParams } from '../app-params';
import { MODULES, PreferencesDbModules, SystemPreferences, UserModule } from '../interfaces';
import { SystemPreferencesApiService } from './system-preferences-api';

@Injectable({
  providedIn: 'root',
})
export class SystemPreferencesService {
  #reloadFromServer$: Subject<void> = new Subject();
  #router = inject(Router);
  #loginService = inject(LoginService);
  #api = inject(SystemPreferencesApiService);

  readonly #preferencesUpdate$ = new Subject<PreferencesDbModules[]>();

  #url = toSignal(
    this.#router.events.pipe(
      filter((ev) => ev instanceof NavigationEnd),
      map((ev: NavigationEnd) => ev.url),
    ),
    { initialValue: this.#router.routerState.snapshot.url },
  );

  defaultPreferences: SystemPreferences = getAppParams('defaultSystemPreferences');

  preferences$: Observable<SystemPreferences> = merge(
    of(this.defaultPreferences),
    this.#loginService.user$.pipe(
      // mainoties user, ielādē no servera
      switchMap((usr) => (usr ? this._systemPreferences() : of(this.defaultPreferences))),
    ),
    this.#reloadFromServer$.pipe(switchMap((_) => this._systemPreferences())),
    this.#preferencesUpdate$.pipe(
      concatMap((pref) => this.#api.updateMany(pref)),
      retry(3),
      switchMap((_) => this._systemPreferences()),
    ),
  ).pipe(
    tap((pref) => (this.defaultPreferences = pref)),
    shareReplay(1),
  );

  private readonly userModules = getAppParams('userModules');

  modules$ = this.#loginService.user$.pipe(
    switchMap((usr) =>
      of(this.userModules.filter((mod) => usr && usr.preferences.modules.includes(mod.route))).pipe(map((modules) => (usr?.google ? modules : removeGmail(modules)))),
    ),
  );
  modules = toSignal(this.modules$, { initialValue: [] });

  activeModules = computed(() => findModulesPath(this.#url(), this.modules()));

  childMenu = computed(() => this.activeModules()[0]?.childMenu || []);

  updatePreferences(pref: SystemPreferences) {
    this.#preferencesUpdate$.next(
      MODULES.map((module) => ({
        module,
        settings: pref[module],
      })) as PreferencesDbModules[],
    );
  }

  private async _systemPreferences(): Promise<SystemPreferences> {
    const dbPreferences = await this.#api.getAll();
    return Object.assign({}, ...dbPreferences.map((mod) => ({ [mod.module]: mod.settings })));
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
