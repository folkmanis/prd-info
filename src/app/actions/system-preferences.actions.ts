import { createAction, props } from '@ngrx/store';
import * as systemPreferencesInterfaces from 'src/app/interfaces/system-preferences';

enum SystemPreferencesActionTypes {
    SystemRequestedPreferencesFromApi = '[System] Requested Preferences From Api',
    ApiRetrievedAllPreferences = '[Api] Retrieved All Preferences',
    ComponentStoredModule = '[Component] Stored Module',
    ApiUpdatedModule = '[Api] Updated Module',
}

export const systemRequestedPreferencesFromApi = createAction(
    SystemPreferencesActionTypes.SystemRequestedPreferencesFromApi
);

export const apiRetrievedAllPreferences = createAction(
    SystemPreferencesActionTypes.ApiRetrievedAllPreferences,
    props<{ systemPreferences: Partial<systemPreferencesInterfaces.SystemPreferencesObject>; }>()
);

export const componentStoredModule = createAction(
    SystemPreferencesActionTypes.ComponentStoredModule,
    props<{
        module: systemPreferencesInterfaces.SystemPreferencesGroups,
        settings: systemPreferencesInterfaces.ModuleSettings,
    }>()
);

export const apiUpdatedModule = createAction(
    SystemPreferencesActionTypes.ApiUpdatedModule,
    props<{
        module: systemPreferencesInterfaces.SystemPreferencesGroups,
        settings: systemPreferencesInterfaces.ModuleSettings,
    }>()
);
