export interface ModuleSettings {
    [key: string]: any;
}

export interface DbModulePreferences {
    module: SystemPreferencesGroups,
    settings: { [key: string]: any; };
}

export type SystemPreferencesGroups = 'kastes' | 'system' | 'jobs';

export type SystemPreferences = Map<SystemPreferencesGroups, ModuleSettings>;

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

export const DEFAULT_SYSTEM_PREFERENCES: SystemPreferences = new Map<SystemPreferencesGroups, ModuleSettings>()
    .set('kastes', <KastesSettings>{
        colors: { yellow: 'hsl(45,75%,60%)', rose: '315,75%,50%', white: '0,0%,50%', },
    })
    .set('system', <SystemSettings>{ menuExpandedByDefault: false })
    .set('jobs', <JobsSettings>{
        productCategories: [
            { category: 'plates', description: 'Iespiedformas' }
        ]
    });
