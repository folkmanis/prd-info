import { createAction, props } from '@ngrx/store';
import * as systemPreferencesInterfaces from 'src/app/interfaces/system-preferences';

enum SystemPreferencesActionTypes {
    systemRequestedPreferencesFromApi = '[System] Requested Preferences From Api',
    apiRetrievedAllPreferences = '[Api] Retrieved All Preferences',
    componentStoredModule = '[Component] Stored Module',
    apiUpdatedModule = '[Api] Updated Module',
    routerNavigated = '[Router] Navigated'
}

export const systemRequestedPreferencesFromApi = createAction(
    SystemPreferencesActionTypes.systemRequestedPreferencesFromApi
);

export const apiRetrievedAllPreferences = createAction(
    SystemPreferencesActionTypes.apiRetrievedAllPreferences,
    props<{ systemPreferences: Partial<systemPreferencesInterfaces.SystemPreferencesObject>; }>()
);

export const componentStoredModule = createAction(
    SystemPreferencesActionTypes.componentStoredModule,
    props<{
        module: systemPreferencesInterfaces.SystemPreferencesGroups,
        settings: systemPreferencesInterfaces.ModuleSettings,
    }>()
);

export const apiUpdatedModule = createAction(
    SystemPreferencesActionTypes.apiUpdatedModule,
    props<{
        module: systemPreferencesInterfaces.SystemPreferencesGroups,
        settings: systemPreferencesInterfaces.ModuleSettings,
    }>()
);

export const routerNavigated = createAction(
    SystemPreferencesActionTypes.routerNavigated,
    props<{ url: string; }>()
);
