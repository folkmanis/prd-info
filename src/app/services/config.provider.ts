import { inject, InjectionToken } from '@angular/core';
import { Observable, map } from 'rxjs';
import { SystemPreferences } from '../interfaces';
import { SystemPreferencesService } from './system-preferences.service';
import { get } from 'lodash-es';


type S = SystemPreferences;
export function getConfig(): Observable<S>;
export function getConfig<
    K1 extends keyof S
>(k1: K1): Observable<S[K1]>;
export function getConfig<
    K1 extends keyof S,
    K2 extends keyof S[K1]
>(k1: K1, k2: K2): Observable<S[K1][K2]>;
export function getConfig<
    K1 extends keyof S,
    K2 extends keyof S[K1],
    K3 extends keyof S[K1][K2]
>(k1: K1, k2: K2, k3: K3): Observable<S[K1][K2][K3]>;
export function getConfig(...path: string[]) {
    return inject(SystemPreferencesService).preferences$.pipe(
        map(pref => path.length ? get(pref, path) : pref),
    );
}