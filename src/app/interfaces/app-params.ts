import { SystemPreferencesObject } from './system-preferences';
import { UserModule } from './user';

export interface AppParams {
    apiPath: string;
    userModules: UserModule[];
    defaultSystemPreferencesObj: SystemPreferencesObject;
}
