import { Inject, Injectable } from '@angular/core';
import { Observable, Subject, combineLatest, merge } from 'rxjs';
import { catchError, map, pluck, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { KastesSettings, SystemPreferences } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { KastesUserPreferences } from 'src/app/kastes/interfaces';
import { CONFIG } from 'src/app/services/config.provider';

const DEFAULT_USER_PREFERENCES: KastesUserPreferences = {
  pasutijums: null
};

@Injectable()
export class KastesPreferencesService {

  constructor(
    private prdApi: PrdApiService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }

  kastesSystemPreferences$ = this.config$.pipe(pluck('kastes'));

  private _reload$ = new Subject<KastesUserPreferences>();

  kastesUserPreferences$: Observable<KastesUserPreferences> = merge(
    this._reload$,
    this.prdApi.kastes.getUserPreferences(),
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

  updateUserPreferences(prefs: Partial<KastesUserPreferences>): Observable<KastesUserPreferences> {
    return this.prdApi.kastes.setUserPreferences(prefs).pipe(
      tap(newPreferences => this._reload$.next(newPreferences)),
    );
  }

}
