import { Action, createReducer, on } from '@ngrx/store';
import { PRD_DEFAULTS } from 'src/app/app-params';
import { SystemPreferencesState } from 'src/app/interfaces';
import { cloneDeep } from 'lodash';
import * as actions from '../actions/system-preferences.actions';

const initialPreferencesState: SystemPreferencesState = {
    systemPreferences: PRD_DEFAULTS.defaultSystemPreferencesObj,
    loading: false,
    error: null,
};

const systemPreferencesReducer = createReducer(
    initialPreferencesState,
    on(actions.systemRequestedPreferencesFromApi, (state, action) => {
        return { ...state, loading: true };
    }),
    on(actions.apiRetrievedAllPreferences, (state, action) => {
        const systemPreferences = { ...state.systemPreferences, ...action.systemPreferences };
        return {
            systemPreferences,
            loading: false,
            error: null,
        };
    }),
    on(actions.componentStoredModule),
    on(actions.apiUpdatedModule, (state, action) => {
        const systemPreferences = { ...state.systemPreferences, [action.modName]: action.settings };
        return { ...state, systemPreferences };
    }),
);

export function reducer(state: SystemPreferencesState | undefined, action: Action) {
    return systemPreferencesReducer(state, action);
}
