import { InjectionToken } from '@angular/core';
import { USER_MODULES } from 'src/app/user-modules';
import { version } from '../version';
import { AppParams } from './interfaces';

export const APP_PARAMS = new InjectionToken<AppParams>('prd.defaults');
export const PRD_DEFAULTS: AppParams = {
    apiPath: '/data/',
    wsPath: '/ws-notifications',
    version,
    passwordMinimumLenght: 3,
    userModules: USER_MODULES,
    messagesReadDelay: 3000,
    defaultSystemPreferences: {
        kastes: {
            colors: { yellow: 'hsl(45,75%,60%)', rose: 'hsl(315,75%,50%)', white: 'hsl(0,0%,50%)', },
        },
        system: {
            menuExpandedByDefault: false,
            hostname: '',
            logLevels: [],
        },
        jobs: {
            productCategories: [
                { category: 'plates', description: 'Iespiedformas' },
                { category: 'perforated paper', description: 'Perforētais papīrs' },
                { category: 'repro', description: 'Repro' },
            ],
            jobStates: [
                { state: 10, description: 'Sagatavošana' },
            ],
            productUnits: [],
        },
        paytraq: {
            enabled: false,
        },
    },
    gmailScope: 'https://www.googleapis.com/auth/gmail.readonly',
};
