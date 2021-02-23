import { FactoryProvider, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemPreferences } from '../interfaces';
import { SystemPreferencesService } from './system-preferences.service';

export const CONFIG = new InjectionToken<Observable<SystemPreferences>>('System configuration');

export const configProvider: FactoryProvider = {
    provide: CONFIG,
    useFactory: (service: SystemPreferencesService) => service.preferences$,
    deps: [SystemPreferencesService],
};

