import { inject, Injectable } from '@angular/core';
import { catchError, map, shareReplay, tap, combineLatest, merge, Observable, Subject } from 'rxjs';
import { KastesUserPreferences } from 'src/app/kastes/interfaces';
import { getConfig } from 'src/app/services/config.provider';
import { KastesApiService } from './kastes-api.service';
import { get } from 'lodash-es';

const DEFAULT_USER_PREFERENCES: KastesUserPreferences = {
  pasutijums: null
};

type P = KastesPreferencesService['preferences$'] extends Observable<infer K> ? K : never;

export function getKastesPreferences(): Observable<P>;
export function getKastesPreferences<K1 extends keyof P>(k1: K1): Observable<P[K1]>;
export function getKastesPreferences<K1 extends keyof P, K2 extends keyof P[K1]>(k1: K1, k2: K2): Observable<P[K1][K2]>;
export function getKastesPreferences(...path: string[]): Observable<any> {
  return inject(KastesPreferencesService).preferences$.pipe(
    map(pr => get(pr, path, pr))
  );
}

@Injectable({
  providedIn: 'any'
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
