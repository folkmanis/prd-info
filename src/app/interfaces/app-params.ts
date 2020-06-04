import { SystemPreferences } from './system-preferences';

export interface AppParams {
    apiPath: string;
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
