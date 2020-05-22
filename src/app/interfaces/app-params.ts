import { SystemPreferences, SystemPreferencesObject } from './system-preferences';

export interface AppParams {
    apiPath: string;
    defaultSystemPreferences: SystemPreferences;
    defaultSystemPreferencesObj: SystemPreferencesObject;
}
