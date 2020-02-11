import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ModulePreferences, SystemPreferences } from '../../library/classes/system-preferences-class';
export { ModulePreferences, SystemPreferences, KastesSettings } from '../../library/classes/system-preferences-class';
import { HttpService } from './admin-http.service';
import { map, filter, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModulePreferencesService {

  private preferences$: BehaviorSubject<SystemPreferences> = new BehaviorSubject<SystemPreferences>(new Map());
  private loaded = false;
  private loading = false;

  constructor(
    private httpService: HttpService,
  ) { }

  getModulePreferences(mod: string): Observable<ModulePreferences> {
    this.loadPreferences();
    return this.preferences$.pipe(
      map(pref => pref.get(mod)),
      filter(modPref => !!modPref),
    );
  }

  updateModulePreferences(modName: string, modPref: ModulePreferences): Observable<boolean> {
    const pref = this.preferences$.value;
    return pref.has(modName) ?
      this.httpService.updateModuleSystemPreferences(modName, modPref).pipe(
        tap(ok => ok && this.preferences$.next(pref.set(modName, modPref)))
      ) : of(false);
  }

  private loadPreferences(forced = false) {
    if (this.loading && (!this.loaded || forced)) { return; }
    this.loading = true;
    this.httpService.getAllSystemPreferencesHttp().subscribe(pref => {
      this.preferences$.next(pref);
      this.loaded = true;
      this.loading = false;
    });
  }

}
