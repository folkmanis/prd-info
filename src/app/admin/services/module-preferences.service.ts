import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ModulePreferences, SystemPreferences } from '../../library/classes/system-preferences-class';
export { ModulePreferences, SystemPreferences, KastesPreferences } from '../../library/classes/system-preferences-class';
import { HttpService } from './http.service';
import { map, filter, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModulePreferencesService {

  private preferences$: BehaviorSubject<SystemPreferences> = new BehaviorSubject<SystemPreferences>([]);
  private loaded = false;
  private loading = false;

  constructor(
    private httpService: HttpService,
  ) { }

  getModulePreferences(mod: string): Observable<ModulePreferences> {
    this.loadPreferences();
    return this.preferences$.pipe(
      map(pref => pref.find(modPref => modPref.module === mod)),
      filter(modPref => !!modPref),
    );
  }

  updateModulePreferences(modPref: ModulePreferences): Observable<boolean> {
    const prefs = this.preferences$.value;
    const idx = prefs.findIndex(val => val.module === modPref.module);
    if (idx === -1) { return of(false); }
    return this.httpService.updateModuleSystemPreferences(modPref).pipe(
      tap(ok => {
        if (ok) {
          prefs[idx] = modPref;
          this.preferences$.next(prefs);
        }
      })
    );
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
