import { InjectionToken, inject } from '@angular/core';
import { USER_MODULES } from 'src/app/user-modules';
import { version } from '../version';
import { AppParams } from './interfaces';
import { get } from 'lodash-es';

export const APP_PARAMS = new InjectionToken<AppParams>('prd.defaults', {
  providedIn: 'root',
  factory: () => PRD_DEFAULTS,
});

export const PRD_DEFAULTS: AppParams = {
  apiPath: '/data/',
  wsPath: '/ws-notifications',
  version,
  passwordMinimumLenght: 3,
  userModules: USER_MODULES,
  messagesReadDelay: 3000,
  defaultSystemPreferences: {
    kastes: {
      colors: { yellow: 'hsl(45,75%,60%)', rose: 'hsl(315,75%,50%)', white: 'hsl(0,0%,50%)' },
    },
    system: {
      menuExpandedByDefault: false,
      hostname: '',
      logLevels: [],
      shippingAddress: null,
    },
    jobs: {
      productCategories: [
        { category: 'plates', description: 'Iespiedformas' },
        { category: 'perforated paper', description: 'Perforētais papīrs' },
        { category: 'repro', description: 'Repro' },
      ],
      jobStates: [{ state: 10, description: 'Sagatavošana' }],
      productUnits: [],
    },
    paytraq: {
      enabled: false,
    },
  },
  gmailScope: 'https://www.googleapis.com/auth/gmail.readonly',
};

type P = AppParams;
export function getAppParams(): P;
export function getAppParams<K1 extends keyof P>(k1: K1): P[K1];
export function getAppParams<K1 extends keyof P, K2 extends keyof P[K1]>(k1: K1, k2: K2): P[K1][K2];
export function getAppParams<K1 extends keyof P, K2 extends keyof P[K1], K3 extends keyof P[K1][K2]>(k1: K1, k2: K2, k3: K3): P[K1][K2][K3];
export function getAppParams<K1 extends keyof P, K2 extends keyof P[K1], K3 extends keyof P[K1][K2], K4 extends keyof P[K1][K2][K3]>(
  k1: K1,
  k2: K2,
  k3: K3,
  k4: K4,
): P[K1][K2][K3][K4];
export function getAppParams(...path: string[]) {
  const params = inject(APP_PARAMS);
  return path.length ? get(params, path) || PRD_DEFAULTS : params;
}
