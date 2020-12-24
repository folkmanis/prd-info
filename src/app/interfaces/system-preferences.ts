import { AppHttpResponseBase } from 'src/app/library/http';
import { Colors } from './kaste';

export interface ModuleSettings {
    [key: string]: any;
}

export interface DbModulePreferences {
    module: SystemPreferencesGroups;
    settings: { [key: string]: any; };
}

export type SystemPreferencesGroups = 'kastes' | 'system' | 'jobs';

export type SystemPreferences = Map<SystemPreferencesGroups, ModuleSettings>;

export class KastesSettings implements ModuleSettings {
    colors: {
        [key in Colors]: string;
    };
}

export class SystemSettings implements ModuleSettings {
    menuExpandedByDefault: boolean;
    logLevels: [number, string][];
}

export class JobsSettings implements ModuleSettings {
    productCategories: Array<{ category: string, description: string; }>;
    jobStates: { state: number, description: string; }[];
}

export interface SystemPreferencesResponse extends AppHttpResponseBase<DbModulePreferences> {
}
