import { Inject, Injectable } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, pluck, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { KastesSettings, SystemPreferences } from 'src/app/interfaces';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { KastesUserPreferences } from 'src/app/interfaces';
import { CONFIG } from 'src/app/services/config.provider';

@Injectable()
export class KastesPreferencesService {

  constructor(
    private prdApi: PrdApiService,
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
  ) { }

  kastesSystemPreferences$ = this.config$.pipe(pluck('kastes'));

  private _userPreferences$: Observable<KastesUserPreferences>;
  private _reload$ = new Subject<void>();

  get kastesUserPreferences$(): Observable<KastesUserPreferences> {
    if (!this._userPreferences$) {
      this._userPreferences$ = this._reload$.pipe(
        startWith({}),
        switchMap(() => this.prdApi.kastes.getUserPreferences()),
        shareReplay(1),
      );
    }
    return this._userPreferences$;
  }

  preferences$ = combineLatest([
    this.kastesSystemPreferences$,
    this.kastesUserPreferences$.pipe(
    ),
  ]).pipe(
    map(([sys, usr]) => ({ ...sys, ...usr })),
  );

  pasutijumsId$ = this.kastesUserPreferences$.pipe(
    map(pref => pref.pasutijums),
  );

  updateUserPreferences(prefs: Partial<KastesUserPreferences>): Observable<boolean> {
    return this.prdApi.kastes.setUserPreferences(prefs).pipe(
      tap(() => this._reload$.next()),
    );
  }

}
