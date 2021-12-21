import { Inject, Injectable } from '@angular/core';
import { combineLatest, merge, Observable, Subject } from 'rxjs';
import { catchError, map, pluck, shareReplay, tap } from 'rxjs/operators';
import { SystemPreferences } from 'src/app/interfaces';
import { KastesUserPreferences } from 'src/app/kastes/interfaces';
import { CONFIG } from 'src/app/services/config.provider';
import { KastesApiService } from './kastes-api.service';

const DEFAULT_USER_PREFERENCES: KastesUserPreferences = {
  pasutijums: null
};

@Injectable({
  providedIn: 'root'
})
export class KastesPreferencesService {

  kastesSystemPreferences$ = this.config$.pipe(pluck('kastes'));

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
    this.kastesUserPreferences$.pipe(
    ),
  ]).pipe(
    map(([sys, usr]) => ({ ...sys, ...usr })),
  );

  pasutijumsId$ = this.kastesUserPreferences$.pipe(
    map(pref => pref?.pasutijums),
  );

  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private api: KastesApiService,
  ) { }

  updateUserPreferences(prefs: Partial<KastesUserPreferences>): Observable<KastesUserPreferences> {
    return this.api.setUserPreferences(prefs).pipe(
      tap(newPreferences => this._reload$.next(newPreferences)),
    );
  }

}
