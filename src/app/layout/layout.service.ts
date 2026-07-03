import { computed, inject, Service } from '@angular/core';
import { PRIMARY_OUTLET, Router, UrlSegment } from '@angular/router';
import { getAppParams } from '../app-params';
import { LoginService } from '../login';
import { UserModule } from '../interfaces';
import { map, of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

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
    const module: UserModule | undefined = userModules?.find((mod) => mod.route === segm);

    if (!module) {
      break;
    }

    userModules = module.childMenu;
    activeModules.push(module);
  }

  return activeModules;
}

@Service()
export class LayoutService {
  #router = inject(Router);
  #currentUrl = this.#router.routerState.snapshot.url;
  #loginService = inject(LoginService);
  readonly #userModules = getAppParams('userModules');
  #url = computed(() => {
    this.#currentUrl =
      this.#router
        .currentNavigation()
        ?.finalUrl?.root.children[PRIMARY_OUTLET].segments.map((s) => s.path)
        .join('/') || this.#router.routerState.snapshot.url;
    return this.#currentUrl;
  });

  modules$ = this.#loginService.user$.pipe(
    switchMap((usr) =>
      of(this.#userModules.filter((mod) => usr && usr.preferences.modules.includes(mod.route))).pipe(
        map((modules) => (usr?.google ? modules : this.#removeGmail(modules))),
      ),
    ),
  );
  modules = toSignal(this.modules$, { initialValue: [] });

  activeModules = computed(() => findModulesPath(this.#url(), this.modules()));

  childMenu = computed(() => this.activeModules()[0]?.childMenu || []);

  #removeGmail(modules: UserModule[]): UserModule[] {
    return modules
      .filter((module) => module.name !== 'gmail')
      .map((module) => (module.childMenu ? { ...module, childMenu: this.#removeGmail(module.childMenu) } : module));
  }
}
