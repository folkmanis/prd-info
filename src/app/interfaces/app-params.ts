import { SystemPreferences } from './system-preferences';

export interface AppParams {
    apiPath: string;
    version: {
        appBuild: number;
    };
    versionCheckInterval: number;
    defaultSystemPreferences: SystemPreferences;
    toolbarHeight: {
        desktop: number;
        mobile: number;
    };
    mediaBreakpoints: {
        small: string;
        medium: string;
    };
}
