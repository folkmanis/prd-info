import { Action, createReducer, on } from '@ngrx/store';
import { LoginState } from 'src/app/interfaces';
import * as LoginActions from '../actions/login.actions';

const initialLoginState: LoginState = {
    initialised: false,
    user: undefined,
    loginProcess: false,
    error: null
};

const loginReducer = createReducer(
    initialLoginState,
    on(LoginActions.login, (state, action) => {
        return { ...state, loginProcess: true };
    }),
    on(LoginActions.apiLoggedIn, (state, action) => {
        return {...state,
            loginProcess: false,
            error: null,
        };
    }),
    on(LoginActions.apiNotLoggedIn, (state, action) => {
        return {
            user: undefined,
            loginProcess: false,
            initialised: true,
            error: action.error,
        };
    }),
    on(LoginActions.apiLoggedOut, (state, action) => {
        return {
            user: undefined,
            loginProcess: false,
            initialised: true,
            error: false,
        };
    }),
    on(LoginActions.apiUserReceived, (state, action) => {
        return {
            user: action.user,
            loginProcess: false,
            initialised: true,
            error: false,
        };
    }),
);

export function reducer(state: LoginState | undefined, action: Action) {
    return loginReducer(state, action);
}
