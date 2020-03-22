export interface ModuleSettings {
    [key: string]: any;
}

export interface DbModulePreferences {
    module: SystemPreferencesGroups,
    settings: { [key: string]: any; };
}

export type SystemPreferencesGroups = 'kastes' | 'system';

export type SystemPreferences = Map<SystemPreferencesGroups, ModuleSettings>;

export interface KastesSettings {
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

export const DEFAULT_SYSTEM_PREFERENCES: SystemPreferences = new Map<SystemPreferencesGroups, ModuleSettings>()
    .set('kastes',
        { colors: { yellow: 'gold', rose: 'magenta', white: 'gray', } })
    .set('system', { menuExpandedByDefault: false });
