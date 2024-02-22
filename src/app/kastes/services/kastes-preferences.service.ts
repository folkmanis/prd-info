import { inject, Injectable, Signal } from '@angular/core';
import { catchError, map, shareReplay, tap, combineLatest, merge, Observable, Subject, of } from 'rxjs';
import { KastesSettings, KastesUserPreferences } from 'src/app/kastes/interfaces';
import { getConfig } from 'src/app/services/config.provider';
import { KastesApiService } from './kastes-api.service';
import { get } from 'lodash-es';
import { toSignal } from '@angular/core/rxjs-interop';
import { SystemPreferencesService } from 'src/app/services';

const DEFAULT_USER_PREFERENCES: KastesUserPreferences = {
  pasutijums: null
};

type P = KastesUserPreferences & KastesSettings;
// KastesPreferencesService['preferences$'] extends Observable<infer K> ? K : never;

export function getKastesPreferences(): Observable<P>;
export function getKastesPreferences<K1 extends keyof P>(k1: K1): Observable<P[K1]>;
export function getKastesPreferences<K1 extends keyof P, K2 extends keyof P[K1]>(k1: K1, k2: K2): Observable<P[K1][K2]>;
export function getKastesPreferences(...path: string[]): Observable<any> {
  return inject(KastesPreferencesService).preferences$.pipe(
    map(pr => get(pr, path, pr))
  );
}

export function kastesPreferences(): Signal<P>;
export function kastesPreferences<K1 extends keyof P>(k1: K1): Signal<P[K1]>;
export function kastesPreferences<K1 extends keyof P, K2 extends keyof P[K1]>(k1: K1, k2: K2): Signal<P[K1][K2]>;
export function kastesPreferences(...path: string[]): Signal<any> {
  return toSignal(inject(KastesPreferencesService).preferences$.pipe(
    map(preferences => path.length ? get(preferences, path, preferences) : preferences)
  ), { requireSync: true });
}

@Injectable({
  providedIn: 'root'
})
export class KastesPreferencesService {

  private api = inject(KastesApiService);

  private reload$ = new Subject<KastesUserPreferences>();

  private kastesSystemPreferences$ = inject(SystemPreferencesService).preferences$.pipe(
    map(preferences => preferences['kastes']),
  );

  private kastesUserPreferences$: Observable<KastesUserPreferences> = merge(
    this.reload$,
    this.api.getUserPreferences(),
    of(DEFAULT_USER_PREFERENCES),
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

  updateUserPreferences(prefs: Partial<KastesUserPreferences>): Observable<KastesUserPreferences> {
    return this.api.setUserPreferences(prefs).pipe(
      tap(newPreferences => this.reload$.next(newPreferences)),
    );
  }

}
