import { User } from './user';
import { SystemPreferencesObject } from './system-preferences';

export interface LoginState {
    initialised: boolean;
    user: User | undefined;
    loginProcess: boolean;
    error: string | null;
}

export interface SystemPreferencesState {
    systemPreferences: SystemPreferencesObject;
    loading: boolean;
    error: string | null;
}

export interface StoreState {
    login: LoginState;
    systemPreferences: SystemPreferencesState;
}
