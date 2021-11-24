import { SystemPreferences } from './system-preferences';
import { UserModule } from './user-module';

export interface AppParams {
    apiPath: string;
    wsPath: string;
    version: {
        appBuild: number;
    };
    defaultSystemPreferences: SystemPreferences;
    toolbarHeight: {
        desktop: number;
        mobile: number;
    };
    userModules: UserModule[];
    mediaBreakpoints: {
        small: string;
        medium: string;
    };
    passwordMinimumLenght: number;
    messagesReadDelay: number;
}
