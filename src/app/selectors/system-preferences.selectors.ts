import { createSelector, createFeatureSelector } from '@ngrx/store';
import { StoreState, SystemPreferencesState } from 'src/app/interfaces/store';
import { SystemPreferencesGroups, SystemPreferencesObject } from 'src/app/interfaces';

export const selectSystemPreferences = createFeatureSelector<SystemPreferencesState>('systemPreferences');

export const getAllPreferences = createSelector(
    selectSystemPreferences,
    (state) => state.systemPreferences
);

export const getModulePreferences = createSelector(
    getAllPreferences,
    (prefs: SystemPreferencesObject, props: { module: SystemPreferencesGroups; }) => prefs[props.module]
);
