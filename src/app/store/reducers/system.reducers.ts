import {
    ActionReducer,
    ActionReducerMap,
    Action,
    createFeatureSelector,
    createSelector,
    on,
    createReducer,
    MetaReducer
} from '@ngrx/store';

import { SystemState } from '../../interfaces/store';
import * as LoginActions from '../actions/login.actions';
import * as SystemPreferencesActions from '../actions/system-preferences.actions';
import { PRD_DEFAULTS } from 'src/app/app-params';

const initialSystemState: SystemState = {
    user: undefined,
    systemPreferences: PRD_DEFAULTS.defaultSystemPreferencesObj,
    userMenu: [],
    activeModule: undefined,

    loading: false,
    initialised: false,
    error: null
};

const _reducer = createReducer<SystemState>(
    initialSystemState,
    on(LoginActions.login, (state, action) =>
        ({ ...state, loginProcess: true })
    ),
    on(LoginActions.apiLoggedIn, (state, action) => ({ ...state, error: null, })),
    on(LoginActions.apiNotLoggedIn, (state, action) => ({ ...state, user: undefined, initialised: true, error: action.error, })),
    on(LoginActions.apiLoggedOut, (state, action) => ({ ...initialSystemState, initialised: true })),
    on(LoginActions.apiUserReceived, (state, action) =>
        ({ ...state, user: action.user, error: null })
    ),
    on(SystemPreferencesActions.systemRequestedPreferencesFromApi, (state, action) =>
        ({ ...state, loading: true })
    ),
    on(SystemPreferencesActions.apiRetrievedAllPreferences, (state, action) => {
        const systemPreferences = { ...state.systemPreferences, ...action.systemPreferences };
        return {
            ...state,
            systemPreferences,
            userMenu: PRD_DEFAULTS.userModules.filter(mod => state.user && state.user.preferences.modules.includes(mod.value)),
            initialised: true,
            loading: false,
            error: null,
        };
    }),
    on(SystemPreferencesActions.componentStoredModule),
    on(SystemPreferencesActions.apiUpdatedModule, (state, action) => {
        const systemPreferences = { ...state.systemPreferences, [action.module]: action.settings };
        return { ...state, systemPreferences };
    }),
    on(SystemPreferencesActions.routerNavigated, (state, action) => {
        const segments = action.url.split('/');
        const activeModule = state.userMenu.find(mod => mod.route === segments[1]);
        return { ...state, activeModule };
    })

);

export function systemReducer(state: SystemState, action: Action) {
    return _reducer(state, action);
}
