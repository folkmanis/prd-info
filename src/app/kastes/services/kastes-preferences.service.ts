import { Injectable } from '@angular/core';
import { catchError, map, shareReplay, tap, combineLatest, merge, Observable, Subject } from 'rxjs';
import { KastesUserPreferences } from 'src/app/kastes/interfaces';
import { getConfig } from 'src/app/services/config.provider';
import { KastesApiService } from './kastes-api.service';

const DEFAULT_USER_PREFERENCES: KastesUserPreferences = {
  pasutijums: null
};

@Injectable({
  providedIn: 'root'
})
export class KastesPreferencesService {

  kastesSystemPreferences$ = getConfig('kastes');

  private _reload$ = new Subject<KastesUserPreferences>();

  kastesUserPreferences$: Observable<KastesUserPreferences> = merge(
    this._reload$,
    this.api.getUserPreferences(),
  ).pipe(
    catchError(() => this.updateUserPreferences(DEFAULT_USER_PREFERENCES)),
    shareReplay(1),
  );

  preferences$ = combineLatest([
    this.kastesSystemPreferences$,
    this.kastesUserPreferences$,
  ]).pipe(
    map(([sys, usr]) => ({ ...sys, ...usr })),
  );

  pasutijumsId$ = this.kastesUserPreferences$.pipe(
    map(pref => pref?.pasutijums),
  );

  constructor(
    private api: KastesApiService,
  ) { }

  updateUserPreferences(prefs: Partial<KastesUserPreferences>): Observable<KastesUserPreferences> {
    return this.api.setUserPreferences(prefs).pipe(
      tap(newPreferences => this._reload$.next(newPreferences)),
    );
  }

}
