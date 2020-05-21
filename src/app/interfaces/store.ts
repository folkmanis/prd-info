import { User } from './user';
import { SystemPreferences } from './system-preferences';

export interface LoginState {
    initialised: boolean;
    user: User | undefined;
    loginProcess: boolean;
    error: string | null;
}

export interface PreferencesState {
    systemPreferences: SystemPreferences;
    error: string | null;
}

export interface StoreState {
    login: LoginState;
    // preferences: StoreInterfaces.PreferencesState;
}
