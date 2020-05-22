import { SystemPreferences, SystemPreferencesObject } from './system-preferences';
import { UserModule } from './user';

export interface AppParams {
    apiPath: string;
    userModules: UserModule[];
    // Depreceated
    defaultSystemPreferences: SystemPreferences;
    defaultSystemPreferencesObj: SystemPreferencesObject;
}
