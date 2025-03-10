import { computed, effect, inject, Injectable, Signal } from '@angular/core';
import { get } from 'lodash-es';
import { Observable, tap } from 'rxjs';
import { KastesSettings, KastesUserPreferences } from 'src/app/kastes/interfaces';
import { configuration } from 'src/app/services/config.provider';
import { DEFAULT_USER_PREFERENCES, KastesApiService } from './kastes-api.service';

type P = KastesUserPreferences & KastesSettings;
// KastesPreferencesService['preferences$'] extends Observable<infer K> ? K : never;

export function kastesPreferences(): Signal<P>;
export function kastesPreferences<K1 extends keyof P>(k1: K1): Signal<P[K1]>;
export function kastesPreferences<K1 extends keyof P, K2 extends keyof P[K1]>(k1: K1, k2: K2): Signal<P[K1][K2]>;
export function kastesPreferences(...path: string[]): Signal<any> {
  const preferences = inject(KastesPreferencesService).preferences;
  return computed(() => {
    const value = preferences();
    return path.length ? get(value, path, value) : value;
  });
}

@Injectable({
  providedIn: 'root',
})
export class KastesPreferencesService {
  private api = inject(KastesApiService);

  private kastesSystemPreferences = configuration('kastes');

  private userPreferencesResource = this.api.userPreferences();

  constructor() {
    effect((onCleanup) => {
      if (this.userPreferencesResource.error()?.['status'] === 404) {
        const subs = this.updateUserPreferences(DEFAULT_USER_PREFERENCES).subscribe();
        onCleanup(() => subs?.unsubscribe());
      }
    });
  }

  preferences = computed(() => {
    const sys = this.kastesSystemPreferences();
    const usr = this.userPreferencesResource.value();
    return { ...sys, ...usr };
  });

  updateUserPreferences(prefs: Partial<KastesUserPreferences>): Observable<KastesUserPreferences> {
    return this.api.setUserPreferences(prefs).pipe(tap((newPreferences) => this.userPreferencesResource.set(newPreferences)));
  }
}
