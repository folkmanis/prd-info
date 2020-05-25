import { Action, createAction, props } from '@ngrx/store';
import { Login, User } from 'src/app/interfaces';

enum LoginActionTypes {
    Login = '[Login Component] Login',  // tiek uzsākts login
    Logout = '[Login Component] Logout', // tiek uzsākts logout
    ApiLoggedIn = '[User Api] User Logged In',
    ApiNotLoggedIn = '[User Api] User Not Logged In',
    ApiLoggedOut = '[User Api] Logged Out',
    ApiUserReceived = '[User Api] User Received',
}

export const login = createAction(
    LoginActionTypes.Login,
    props<Login>()
);

export const logout = createAction(
    LoginActionTypes.Logout
);

export const apiLoggedIn = createAction(
    LoginActionTypes.ApiLoggedIn,
    props<{ user: User; }>()
);

export const apiNotLoggedIn = createAction(
    LoginActionTypes.ApiNotLoggedIn,
    props<{ error: string; }>()
);

export const apiLoggedOut = createAction(
    LoginActionTypes.ApiLoggedOut
);

export const apiUserReceived = createAction(
    LoginActionTypes.ApiUserReceived,
    props<{ user: User | undefined; }>(),
);
