import { Injectable, Inject } from '@angular/core';
import { merge, Observable, Subject, of, BehaviorSubject } from 'rxjs';
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
    private prdApi: PrdApiService,
    private loginService: LoginService,
  ) { }

  activeModule$: BehaviorSubject<UserModule | null> = new BehaviorSubject(null);
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
  get modules$(): Observable<UserModule[]> {
    return this.loginService.user$.pipe(
      map(usr => USER_MODULES.filter(mod => usr && usr.preferences.modules.includes(mod.value)))
    );
  }

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

  /**
   * Vai lietotājam ir pieejams modulis mod
   * @param mod moduļa nosaukums
   */
  isModule(mod: string): Observable<boolean> {
    return this.loginService.user$.pipe(
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
  // reloadPreferences(): Observable<boolean> {
  //   return this.loginService.user$.pipe(
  //     take(1),
  //     switchMap(usr => usr ? this.systemPreferencesMap() : of(this.params.defaultSystemPreferences)),
  //     tap(pref => this.newPreferences$.next(pref)),
  //     map(pref => !!pref),
  //   );
  // }

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
