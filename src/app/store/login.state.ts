import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, createSelector } from '@ngxs/store';
import { patch, removeItem, insertItem } from '@ngxs/store/operators';
import { AppParams, Login, SystemPreferences, User } from 'src/app/interfaces';
import * as LoginActions from './login.actions';

export interface LoginStateModel {
    user: User | undefined;
    isLoaded: boolean;
}

@State<LoginStateModel>({
    name: 'login',
    defaults: {
        user: undefined,
        isLoaded: false,
    }
})
@Injectable()
export class LoginState {

    constructor() { }

    @Selector()
    static user(state: LoginStateModel): User | undefined {
        return state.user;
    }

    @Selector()
    static isLogin(state: LoginStateModel): boolean {
        return !!state.user;
    }

    static isModule(mod: string): (state: LoginStateModel) => boolean {
        const selector = createSelector(
            [LoginState],
            (state: LoginStateModel) => state.user && !!state.user.preferences.modules.find(m => m === mod)
        );
        return selector;
    }
}
