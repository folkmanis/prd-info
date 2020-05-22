import { AppHttpResponseBase } from 'src/app/library/http';

export interface ModuleSettings {
    [key: string]: any;
}

export type SystemPreferencesGroups = 'kastes' | 'system' | 'jobs';

// export type SystemPreferences = Map<SystemPreferencesGroups, ModuleSettings>;

export type SystemPreferencesObject = {
    [key in SystemPreferencesGroups]: ModuleSettings;
};

export class KastesSettings implements ModuleSettings {
    colors: {
        yellow: string;
        rose: string;
        white: string;
    };
}

export class SystemSettings implements ModuleSettings {
    menuExpandedByDefault: boolean;
    logLevels: [number, string][];
}

export class JobsSettings implements ModuleSettings {
    productCategories: Array<{ category: string, description: string; }>;
}

export interface SystemPreferencesResponse extends AppHttpResponseBase<DbModulePreferences> {
}

export interface DbModulePreferences {
    module: SystemPreferencesGroups;
    settings: { [key: string]: any; };
}
