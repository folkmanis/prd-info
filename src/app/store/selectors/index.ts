import { createSelector, createFeatureSelector } from '@ngrx/store';
import { StoreState, SystemState } from 'src/app/interfaces/store';
import { SystemPreferencesGroups, SystemPreferencesObject, UserModule } from 'src/app/interfaces';

export const selectSystem = createFeatureSelector<StoreState, SystemState>('system');

export const isLoggedIn = createSelector(
    selectSystem,
    (state: SystemState) => !!state.user
);

export const isLoaded = createSelector(
    selectSystem,
    (state: SystemState) => state.initialised
);

export const userName = createSelector(
    selectSystem,
    (state: SystemState) => state.user?.name
);

export const user = createSelector(
    selectSystem,
    (state: SystemState) => state.user
);

export const loginError = createSelector(
    selectSystem,
    (state: SystemState) => state.error
);

export const getAllPreferences = createSelector(
    selectSystem,
    (state) => state.systemPreferences
);

export const getModulePreferences = createSelector(
    getAllPreferences,
    (prefs: SystemPreferencesObject, props: { module: SystemPreferencesGroups; }) => prefs[props.module]
);

export const getMenuModules = createSelector(
    selectSystem,
    (state) => state.userMenu
);

export const childMenu = createSelector(
    getMenuModules,
    (mod: UserModule[], props: { module: string; }) => mod.find(md => md.value === props.module).childMenu || []
);
