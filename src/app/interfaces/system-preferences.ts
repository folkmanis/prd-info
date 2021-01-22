import { AppHttpResponseBase } from 'src/app/library/http';
import { Colors } from './kaste';

export const MODULES = ['kastes', 'system', 'jobs'] as const;

export type ModuleSettings = KastesSettings | SystemSettings | JobsSettings;

export interface DbModulePreferences {
    module: SystemPreferencesGroups;
    settings: ModuleSettings;
}

export type SystemPreferencesGroups = typeof MODULES[number];

export type SystemPreferences = Map<SystemPreferencesGroups, ModuleSettings>;

export interface KastesSettings {
    colors: {
        [key in Colors]: string;
    };
}

export interface SystemSettings {
    menuExpandedByDefault: boolean;
    logLevels: [number, string][];
}

export interface ProductCategory {
    category: string;
    description: string;
}

export interface JobState {
    state: number;
    description: string;
}

export interface JobsSettings {
    productCategories: ProductCategory[];
    jobStates: JobState[];
}



export interface SystemPreferencesResponse extends AppHttpResponseBase<DbModulePreferences> {
}
