import { User, UserModule } from './user';
import { SystemPreferencesObject } from './system-preferences';

export interface SystemState {
    user: User | undefined;
    systemPreferences: SystemPreferencesObject;
    userMenu: UserModule[];
    activeModule: UserModule | undefined;

    loading: boolean;
    initialised: boolean;
    error: string | null;
}

export interface StoreState {
    system: SystemState;
}
