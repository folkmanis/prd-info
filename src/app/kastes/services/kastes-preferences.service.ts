import { Injectable } from '@angular/core';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { KastesSettings } from 'src/app/interfaces';
import { SystemPreferencesService } from 'src/app/services';
import { PrdApiService } from 'src/app/services/prd-api/prd-api.service';
import { KastesUserPreferences } from 'src/app/interfaces';

@Injectable()
export class KastesPreferencesService {

  constructor(
    private systemPreferencesService: SystemPreferencesService,
    private prdApi: PrdApiService,
  ) { }

  kastesSystemPreferences$ = this.systemPreferencesService.sysPreferences$.pipe(
    map(sys => sys.get('kastes') as KastesSettings),
  );

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

  updateUserPreferences(prefs: Partial<KastesUserPreferences>): Observable<boolean> {
    return this.prdApi.kastes.setUserPreferences(prefs).pipe(
    tap(() => this._reload$.next()),
    );
  }

}
