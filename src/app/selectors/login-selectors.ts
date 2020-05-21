import { createSelector, createFeatureSelector } from '@ngrx/store';
import { StoreState, LoginState } from 'src/app/interfaces/store';

export const selectLogin = createFeatureSelector<StoreState, LoginState>('login');

export const isLoggedIn = createSelector(
    selectLogin,
    (state: LoginState) => !!state.user
);

export const isLoaded = createSelector(
    selectLogin,
    (state: LoginState) => state.initialised
);

export const userName = createSelector(
    selectLogin,
    (state: LoginState) => state.user?.name
);

export const user = createSelector(
    selectLogin,
    (state: LoginState) => state.user
);

export const loginError = createSelector(
    selectLogin,
    (state: LoginState) => state.error
);
