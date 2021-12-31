import { inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemPreferences } from '../interfaces';
import { SystemPreferencesService } from './system-preferences.service';

export const CONFIG = new InjectionToken<Observable<SystemPreferences>>(
    'System configuration',
    {
        providedIn: 'root',
        factory: () => inject(SystemPreferencesService).preferences$
    }
);
