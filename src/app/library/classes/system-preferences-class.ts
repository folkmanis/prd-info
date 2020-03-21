export interface ModuleSettings {
    [key: string]: any;
}

export interface DbModulePreferences {
    module: string,
    settings: { [key: string]: any; };
}

export interface SystemPreferences extends Map<string, ModuleSettings> { }

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

export const DEFAULT_SYSTEM_PREFERENCES: SystemPreferences = new Map<string, ModuleSettings>()
    .set('kastes',
        { colors: { yellow: 'gold', rose: 'magenta', white: 'gray', } })
    .set('system', { menuExpandedByDefault: false });
