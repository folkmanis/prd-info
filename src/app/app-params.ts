import { InjectionToken } from '@angular/core';
import {
    AppParams,
    SystemPreferencesGroups,
    ModuleSettings,
    KastesSettings,
    SystemSettings,
    JobsSettings,
} from './interfaces';

export const APP_PARAMS = new InjectionToken<AppParams>('prd.defaults');

export const PRD_DEFAULTS: AppParams = {
    apiPath: '/data/',
    defaultSystemPreferences: new Map<SystemPreferencesGroups, ModuleSettings>()
        .set('kastes', {
            colors: { yellow: 'hsl(45,75%,60%)', rose: '315,75%,50%', white: '0,0%,50%', },
        } as KastesSettings)
        .set('system', { menuExpandedByDefault: false } as SystemSettings)
        .set('jobs', {
            productCategories: [
                { category: 'plates', description: 'Iespiedformas' },
                { category: 'perforated paper', description: 'Perforētais papīrs' }
            ]
        } as JobsSettings),
};
