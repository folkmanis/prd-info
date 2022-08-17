import { SystemPreferences } from './system-preferences';
import { UserModule } from './user-module';

export interface AppParams {
    apiPath: string;
    wsPath: string;
    version: {
        appBuild: number;
    };
    defaultSystemPreferences: SystemPreferences;
    userModules: UserModule[];
    passwordMinimumLenght: number;
    messagesReadDelay: number;
    gmailScope: string;
}
