import { computed, inject, Signal } from '@angular/core';
import { get } from 'lodash-es';
import { SystemPreferences } from '../interfaces';
import { SystemPreferencesService } from './system-preferences.service';

type S = SystemPreferences;

export function configuration(): Signal<S>;
export function configuration<K1 extends keyof S>(k1: K1): Signal<S[K1]>;
export function configuration<K1 extends keyof S, K2 extends keyof S[K1]>(k1: K1, k2: K2): Signal<S[K1][K2]>;
export function configuration<K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2]>(
  k1: K1,
  k2: K2,
  k3: K3,
): Signal<S[K1][K2][K3]>;
export function configuration(...path: string[]) {
  const preferences = inject(SystemPreferencesService).preferences;
  return computed(() => (path.length ? get(preferences(), path) : preferences()));
}
